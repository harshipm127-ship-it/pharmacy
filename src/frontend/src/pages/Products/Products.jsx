import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import cartService from '../../services/cartService'
import customerApi from '../../services/customerApi'
import './Products.css'

// Removed fallback/sample product data — Products page will show empty state when API returns no products.

const brands = ['All', 'Cipla', 'Sun Pharma', 'Himalaya', 'Dabur', 'Zest Labs', 'PulseCare']
const categories = ['All', 'Pain Relief', 'Diabetes Care', 'Heart Care', 'Baby Care', 'Vitamins', 'First Aid']
const priceMarks = [500, 1000, 1500, 2500]

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
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

function Products() {
  const auth = useContext(AuthContext)
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(2500)
  const [minRating, setMinRating] = useState(1)
  const [stockFilter, setStockFilter] = useState('All')
  const [discountFilter, setDiscountFilter] = useState('All')
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Popularity')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [apiFailed, setApiFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const categoryQuery = queryParams.get('category')
    const searchQuery = queryParams.get('search')

    if (searchQuery !== null) {
      setSearchTerm(searchQuery)
    }

    if (categoryQuery && categories.includes(categoryQuery)) {
      setSelectedCategory(categoryQuery)
    }
  }, [location.search])

  useEffect(() => {
    const params = {
      search: searchTerm || undefined,
      status: 'active',
      publish_status: 'published',
      stock_status: stockFilter === 'All' ? undefined : stockFilter === 'In Stock' ? 'in_stock' : 'out_of_stock',
      sort_by: {
        Popularity: 'newest',
        'Price Low to High': 'price_asc',
        'Price High to Low': 'price_desc',
        'New Arrivals': 'newest'
      }[sortBy],
      limit: 100
    }

    setApiFailed(false)
    setIsLoading(true)

    customerApi.products
      .list(params)
      .then((response) => {
        setProducts(Array.isArray(response) ? response : [])
      })
      .catch(() => {
        setProducts([])
        setApiFailed(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [location.search, searchTerm, stockFilter, sortBy])

  const handleAddToCart = async (product) => {
    if (auth?.isAuthenticated) {
      try {
        await customerApi.cart.add(product.id, 1)
      } catch {
        cartService.addToCart(product)
      }
      return
    }

    cartService.addToCart(product)
  }

  const displayProducts = useMemo(() => {
    const baseProducts = products.length > 0 ? products : []

    const normalizedProducts = baseProducts.map((product) => ({
      ...product,
      brand: product.brand?.name || product.brand || 'Generic Brand',
      category: product.category?.name || product.category || 'Healthcare',
      prescription_required: product.requires_prescription ?? product.prescription_required ?? false,
      image: product.image_url || product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
      price: Number(product.selling_price || product.final_price || product.mrp || product.price || 0),
      discount: Number(product.discount || 0),
      rating: Number(product.rating || 4.5),
      stock: Number(product.stock || 0)
    }))

    const filteredProducts = normalizedProducts.filter((product) => {
      const matchesSearch = [product.name, product.brand, product.category]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())

      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice = product.price <= priceRange
      const matchesRating = product.rating >= minRating

      const matchesStock = stockFilter === 'All'
        || (stockFilter === 'In Stock' && product.stock > 0)
        || (stockFilter === 'Out of Stock' && product.stock <= 0)

      const matchesDiscount = discountFilter === 'All' || product.discount >= Number(discountFilter)
      const matchesPrescription = !prescriptionOnly || product.prescription_required

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesDiscount && matchesPrescription
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'Price Low to High') {
        return a.price - b.price
      }

      if (sortBy === 'Price High to Low') {
        return b.price - a.price
      }

      if (sortBy === 'New Arrivals') {
        return b.id - a.id
      }

      return b.rating - a.rating
    })

    return sortedProducts
  }, [products, searchTerm, selectedBrand, selectedCategory, priceRange, minRating, stockFilter, discountFilter, prescriptionOnly, sortBy])

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
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <span>Price Range</span>
          <input type='range' min='500' max='2500' step='100' value={priceRange} onChange={(event) => setPriceRange(event.target.value)} />
          <div className='range-readout'>Up to {formatPrice(priceRange)}</div>
          <div className='range-readout'>Suggested: {priceMarks.join(' • ')}</div>
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
          <label htmlFor='stock'>Stock</label>
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
          <input
            type='text'
            placeholder='Search medicines, brands...'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <span className='voice-icon'>🎙️</span>
        </div>

        <div className='results-header'>
          <div>
            <h2>Search Results</h2>
            <p>{displayProducts.length} products found</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(true)}>Filters</button>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option>Popularity</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>New Arrivals</option>
            </select>
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <div className='empty-state'>
            <h3>No products matched your filters.</h3>
            <p>Try adjusting the search term or resetting the filters.</p>
          </div>
        ) : (
          <div className='product-results-grid'>
            {displayProducts.map((product) => {
              const stockState = getStockState(product.stock)

              return (
                <article className='product-result-card' key={product.id}>
                  <img src={product.image} alt={product.name} />
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
                    <button className='result-btn-secondary' type='button'>Buy Now</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Products
