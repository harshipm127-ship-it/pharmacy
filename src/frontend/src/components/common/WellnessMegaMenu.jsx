import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customerApi from '../../services/customerApi'

function WellnessMegaMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [categoryTree, setCategoryTree] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    let isMounted = true

    customerApi.categories.tree()
      .then((response) => {
        if (isMounted) {
          const categories = Array.isArray(response) ? response : []
          setCategoryTree(categories)
          const wellnessRoot = categories.find((category) => {
            const slug = (category?.slug || '').toLowerCase()
            const name = (category?.name || '').toLowerCase()
            return slug === 'wellness' || name === 'wellness'
          })
          const firstChild = wellnessRoot?.children?.[0]
          setSelectedCategory(firstChild?.id || '')
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategoryTree([])
          setSelectedCategory('')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const wellnessRoot = useMemo(() => categoryTree.find((category) => {
    const slug = (category?.slug || '').toLowerCase()
    const name = (category?.name || '').toLowerCase()
    return slug === 'wellness' || name === 'wellness'
  }) || null, [categoryTree])

  const selectedCategoryData = useMemo(() => {
    if (!wellnessRoot?.children?.length) {
      return null
    }

    return wellnessRoot.children.find((category) => category.id === selectedCategory) || wellnessRoot.children[0] || null
  }, [selectedCategory, wellnessRoot])

  useEffect(() => {
    if (isOpen && !selectedCategory && wellnessRoot?.children?.length) {
      setSelectedCategory(wellnessRoot.children[0].id)
    }
  }, [isOpen, selectedCategory, wellnessRoot])

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleNavigate = (slug) => {
    navigate(`/wellness/${slug}`)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className='wellness-mega-menu open'>
      <div className='wellness-menu-layout'>
        <aside className='wellness-category-column'>
          {(wellnessRoot?.children || []).map((category) => (
            <button
              key={category.id}
              type='button'
              className={`wellness-category-item ${selectedCategory === category.id ? 'selected' : ''}`}
              onMouseEnter={() => handleCategorySelect(category.id)}
              onFocus={() => handleCategorySelect(category.id)}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </aside>

        <section className='wellness-subcategory-column'>
          <div className='wellness-panel-header'>
            <span>{selectedCategoryData?.name || 'Wellness'}</span>
          </div>

          <div className='wellness-subcategory-list'>
            {selectedCategoryData ? (
              <>
                <button type='button' className='wellness-subcategory-item wellness-view-all' onClick={() => handleNavigate(selectedCategoryData.slug)}>
                  View all {selectedCategoryData.name}
                </button>
                {(selectedCategoryData.children || []).map((subcategory) => (
                  <button
                    key={subcategory.id}
                    type='button'
                    className='wellness-subcategory-item'
                    onClick={() => handleNavigate(subcategory.slug)}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

export default WellnessMegaMenu
