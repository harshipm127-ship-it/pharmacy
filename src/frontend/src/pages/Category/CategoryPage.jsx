import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import cartService from '../../services/cartService'
import customerApi, { getImageUrl } from '../../services/customerApi'
import '../Products/Products.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function getStockState(stock) {
  if (stock <= 0) {
    return { label: 'Out of Stock', className: 'out-of-stock' }
  }

  if (stock <= 15) {
    return { label: 'Low Stock', className: 'low-stock' }
  }

  return { label: 'In Stock', className: 'in-stock' }
}

function buildBreadcrumbPath(category, categoryTree) {
  if (!category) {
    return [{ label: 'Home', to: '/' }]
  }

  const result = [{ label: 'Home', to: '/' }]
  const findPath = (nodes, targetId, path = []) => {
    for (const node of nodes || []) {
      const nextPath = [...path, { label: node.name, slug: node.slug, id: node.id }]
      if (node.id === targetId) {
        result.push(...nextPath.slice(1))
        return true
      }

      if (findPath(node.children, targetId, nextPath)) {
        return true
      }
    }

    return false
  }

  findPath(categoryTree, category.id, [])
  return result
}

function CategoryPage() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [categoryTree, setCategoryTree] = useState([])
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState(2500)
  const [minRating, setMinRating] = useState(1)
  const [stockFilter, setStockFilter] = useState('All')
  const [discountFilter, setDiscountFilter] = useState('All')
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Popularity')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    let isMounted = true

    async function loadCategoryData() {
      try {
        setLoading(true)
        setCurrentPage(1)

        const [categoryResponse, treeResponse, brandsResponse] = await Promise.all([
          customerApi.categories.getBySlug(categorySlug).catch(() => null),
          customerApi.categories.tree().catch(() => []),
          customerApi.brands.list({ limit: 100 }).catch(() => []),
        ])

        if (!isMounted) {
          return
        }

        const resolvedCategory = categoryResponse || null
        setCategory(resolvedCategory)
        setCategoryTree(Array.isArray(treeResponse) ? treeResponse : [])
        setBrands(Array.isArray(brandsResponse) ? brandsResponse : [])

        let productResponse = []
        if (resolvedCategory?.id) {
          productResponse = await customerApi.products.list({
            category_id: resolvedCategory.id,
            status: 'active',
            publish_status: 'published',
            limit: 100,
          }).catch(() => [])
        }

        if (!isMounted) {
          return
        }

        setProducts(Array.isArray(productResponse) ? productResponse : [])
      } catch {
        if (isMounted) {
          setCategory(null)
          setCategoryTree([])
          setProducts([])
          setBrands([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (categorySlug) {
      loadCategoryData()
    } else {
      setLoading(false)
      setCategory(null)
      setProducts([])
      setBrands([])
    }

    return () => {
      isMounted = false
    }
  }, [categorySlug])

  const breadcrumb = useMemo(() => buildBreadcrumbPath(category, categoryTree), [category, categoryTree])

  const displayProducts = useMemo(() => {
    const normalizedProducts = (products || []).map((product) => ({
      ...product,
      brand: product.brand?.name || product.brand || 'Generic Brand',
      category: product.category?.name || product.category || category?.name || 'Category',
      prescription_required: product.requires_prescription ?? product.prescription_required ?? false,
      image: product.image_url || product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
      price: Number(product.selling_price || product.final_price || product.mrp || product.price || 0),
      discount: Number(product.discount || 0),
      rating: Number(product.rating || 4.5),
      stock: Number(product.stock || 0),
    }))

    const filteredProducts = normalizedProducts.filter((product) => {
      const matchesSearch = [product.name, product.brand, product.category]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())

      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand
      const matchesPrice = product.price <= priceRange
      const matchesRating = product.rating >= minRating
      const matchesStock = stockFilter === 'All'
        || (stockFilter === 'In Stock' && product.stock > 0)
        || (stockFilter === 'Out of Stock' && product.stock <= 0)
      const matchesDiscount = discountFilter === 'All' || product.discount >= Number(discountFilter)
      const matchesPrescription = !prescriptionOnly || product.prescription_required

      return matchesSearch && matchesBrand && matchesPrice && matchesRating && matchesStock && matchesDiscount && matchesPrescription
    })

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'Price Low to High') return a.price - b.price
      if (sortBy === 'Price High to Low') return b.price - a.price
      if (sortBy === 'Newest') return b.id - a.id
      if (sortBy === 'Best Selling') return b.rating - a.rating
      if (sortBy === 'Discount') return b.discount - a.discount
      return b.rating - a.rating
    })
  }, [products, category, searchTerm, selectedBrand, priceRange, minRating, stockFilter, discountFilter, prescriptionOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(displayProducts.length / pageSize))
  const pagedProducts = displayProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const brandOptions = useMemo(() => ['All', ...new Set((brands || []).map((brand) => brand.name || brand.manufacturer).filter(Boolean))], [brands])

  const handleAddToCart = (product) => {
    cartService.addToCart(product)
  }

  const handleAddToWishlist = (product) => {
    const key = 'medcart_wishlist'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    if (!stored.some((item) => item.id === product.id)) {
      stored.push({ id: product.id, name: product.name })
      localStorage.setItem(key, JSON.stringify(stored))
    }
  }

  return (
    <section className='products-page'>
      <aside className={`filter-sidebar ${mobileFiltersOpen ? '' : 'filters-hidden'}`}>
        <div className='filter-header'>
          <h2>Filters</h2>
          <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(false)}>Close</button>
        </div>

        <div className='filter-group'>
          <label htmlFor='brand'>Brand</label>
          <select id='brand' value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <span>Price Range</span>
          <input type='range' min='500' max='2500' step='100' value={priceRange} onChange={(event) => setPriceRange(Number(event.target.value))} />
          <div className='range-readout'>Up to {formatPrice(priceRange)}</div>
        </div>

        <div className='filter-group'>
          <label htmlFor='rating'>Rating</label>
          <select id='rating' value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
            <option value={1}>1★ & above</option>
            <option value={2}>2★ & above</option>
            <option value={3}>3★ & above</option>
            <option value={4}>4★ & above</option>
            <option value={5}>5★</option>
          </select>
        </div>

        <div className='filter-group'>
          <label htmlFor='stock'>Availability</label>
          <select id='stock' value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value='All'>All</option>
            <option value='In Stock'>In Stock</option>
            <option value='Out of Stock'>Out of Stock</option>
          </select>
        </div>

        <div className='filter-group'>
          <label htmlFor='discount'>Discount</label>
          <select id='discount' value={discountFilter} onChange={(event) => setDiscountFilter(event.target.value)}>
            <option value='All'>All Discounts</option>
            <option value='10'>10%+</option>
            <option value='20'>20%+</option>
            <option value='50'>50%+</option>
          </select>
        </div>

        <div className='filter-group'>
          <div className='toggle-row'>
            <label htmlFor='prescription'>Prescription Required</label>
            <input id='prescription' type='checkbox' checked={prescriptionOnly} onChange={(event) => setPrescriptionOnly(event.target.checked)} />
          </div>
        </div>
      </aside>

      <div className='results-panel'>
        <div className='search-toolbar'>
          <span className='search-icon'>🔎</span>
          <input type='text' placeholder='Search within this category' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          <span className='voice-icon'>🎙️</span>
        </div>

        <div className='results-header'>
          <div>
            <nav className='breadcrumb' aria-label='Breadcrumb'>
              {breadcrumb.map((item, index) => (
                <span key={`${item.label}-${index}`}>
                  {index > 0 ? ' / ' : ''}
                  {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                </span>
              ))}
            </nav>
            <h2>{category?.name || 'Category'}</h2>
            <p>{loading ? 'Loading products...' : category ? `${displayProducts.length} products found` : 'Category not found'}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(true)}>Filters</button>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option>Popularity</option>
              <option>Newest</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Best Selling</option>
              <option>Discount</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className='empty-state'>
            <h3>Loading products...</h3>
          </div>
        ) : !category ? (
          <div className='empty-state'>
            <h3>404 Category Not Found</h3>
            <p>This category does not exist or could not be loaded.</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className='empty-state'>
            <h3>No products available in this category.</h3>
            <p>Try another category or check back soon for fresh arrivals.</p>
          </div>
        ) : (
          <>
            <div className='product-results-grid'>
              {pagedProducts.map((product) => {
                const stockState = getStockState(product.stock)
                return (
                  <article className='product-result-card' key={product.id}>
                    <img src={getImageUrl(product.image) || product.image} alt={product.name} />
                    <div className='product-result-meta'>
                      <span>{product.brand}</span>
                      <span className='discount-pill'>{product.discount}% Off</span>
                    </div>
                    <h3>{product.name}</h3>
                    <div className='product-result-row'>
                      <span className='price-text'>{formatPrice(product.price)}</span>
                      <span>⭐ {product.rating}</span>
                    </div>
                    <div className='product-result-row'>
                      <span className={`stock-pill ${stockState.className}`}>{stockState.label}</span>
                      <small>{product.category}</small>
                    </div>
                    <div className='product-result-actions'>
                      <button className='result-btn' type='button' onClick={() => handleAddToCart(product)}>Add to Cart</button>
                      <button className='result-btn-secondary' type='button' onClick={() => handleAddToWishlist(product)}>Wishlist</button>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className='pagination-row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <button type='button' className='result-btn-secondary' disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button type='button' className='result-btn-secondary' disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default CategoryPage
