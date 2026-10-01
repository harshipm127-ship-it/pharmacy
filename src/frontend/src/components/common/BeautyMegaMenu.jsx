import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customerApi from '../../services/customerApi'

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function BeautyMegaMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const selectedCategoryData = useMemo(
    () => categories.find((category) => category.name === selectedCategory) ?? categories[0] ?? {},
    [selectedCategory, categories]
  )

  const subcategories = useMemo(() => {
    if (Array.isArray(selectedCategoryData.children) && selectedCategoryData.children.length > 0) {
      return selectedCategoryData.children.map((child) => child.name)
    }

    return selectedCategoryData.subcategories ?? []
  }, [selectedCategoryData])

  useEffect(() => {
    if (!isOpen) return

    customerApi.categories
      .list({ limit: 50, status: 'active' })
      .then((resp) => {
        if (Array.isArray(resp) && resp.length > 0) {
          const beautyCategory = resp.find(
            (category) => category.slug === 'beauty' || category.name?.toLowerCase() === 'beauty'
          )
          if (beautyCategory) {
            setCategories([beautyCategory])
            setSelectedCategory(beautyCategory.name)
          }
        }
      })
      .catch(() => setCategories([]))
  }, [isOpen])

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName)
  }

  const handleSubcategoryNavigate = (subcategory) => {
    navigate(`/beauty/${slugify(subcategory)}`)
    onClose()
  }

  return (
    <div className={`beauty-mega-menu ${isOpen ? 'open' : ''}`}>
      <div className='beauty-menu-layout'>
        <aside className='beauty-category-column'>
          {categories.map((category) => (
            <button
              key={category.id || category.name}
              type='button'
              className={`beauty-category-item ${selectedCategory === category.name ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category.name)}
            >
              {category.name}
            </button>
          ))}
        </aside>

        <section className='beauty-subcategory-column'>
          <div className='beauty-panel-header'>
            <span>{selectedCategoryData.name}</span>
          </div>

          <div className='beauty-subcategory-list'>
            {subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  type='button'
                  className='beauty-subcategory-item'
                  onClick={() => handleSubcategoryNavigate(subcategory)}
                >
                  {subcategory}
                </button>
              ))
            ) : (
              <div className='empty-state'>No subcategories available.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BeautyMegaMenu
