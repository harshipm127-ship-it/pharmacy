import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import customerApi from '../../services/customerApi'

function MegaDropdown({ rootCategory, onClose, isOpen }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [categoryTree, setCategoryTree] = useState([])

  useEffect(() => {
    let isMounted = true

    customerApi.categories.tree()
      .then((response) => {
        if (isMounted) {
          setCategoryTree(Array.isArray(response) ? response : [])
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategoryTree([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const rootCategoryData = useMemo(() => {
    const normalizedRootName = (rootCategory?.name || '').toLowerCase()
    const normalizedSlug = (rootCategory?.slug || '').toLowerCase()

    return categoryTree.find((entry) => {
      const entryName = (entry?.name || '').toLowerCase()
      const entrySlug = (entry?.slug || '').toLowerCase()
      return entrySlug === normalizedSlug || entryName === normalizedRootName
    }) || null
  }, [categoryTree, rootCategory?.name, rootCategory?.slug])

  const directChildren = useMemo(() => rootCategoryData?.children ?? rootCategory?.children ?? [], [rootCategoryData, rootCategory])

  const activeChild = useMemo(() => {
    if (!activeCategory && directChildren.length > 0) {
      return directChildren[0]
    }
    return directChildren.find((item) => item.id === activeCategory) ?? directChildren[0]
  }, [activeCategory, directChildren])

  const handleCategorySelect = (child) => {
    setActiveCategory(child.id)
  }

  const getCategoryRoute = (slug) => {
    if (rootCategoryData?.slug === 'beauty' || rootCategory?.slug === 'beauty') {
      return `/beauty/${slug}`
    }

    if (rootCategoryData?.slug === 'wellness' || rootCategory?.slug === 'wellness') {
      return `/wellness/${slug}`
    }

    if (rootCategoryData?.slug === 'medicine' || rootCategory?.slug === 'medicine' || rootCategoryData?.slug === 'medicines' || rootCategory?.slug === 'medicines') {
      return `/medicine/${slug}`
    }

    return `/category/${slug}`
  }

  return (
    <div className={`mega-dropdown ${isOpen ? 'open' : ''}`}>
      <div className='mega-dropdown-left'>
        <div className='mega-dropdown-label'>{rootCategory?.name}</div>
        <div className='mega-dropdown-list'>
          {directChildren.map((child) => (
            <button
              key={child.id}
              type='button'
              className={`mega-dropdown-item ${activeChild?.id === child.id ? 'selected' : ''}`}
              onMouseEnter={() => handleCategorySelect(child)}
              onFocus={() => handleCategorySelect(child)}
              onClick={() => handleCategorySelect(child)}
            >
              {child.name}
            </button>
          ))}
          {!directChildren.length && <div className='mega-dropdown-empty'>No categories yet</div>}
        </div>
      </div>

      <div className='mega-dropdown-right'>
        <div className='mega-dropdown-panel'>
          <div className='mega-dropdown-panel-title'>{activeChild?.name || 'No category selected'}</div>
          <div className='mega-dropdown-panel-grid'>
            {activeChild?.children?.map((sub) => (
              <Link
                key={sub.id}
                to={getCategoryRoute(sub.slug || sub.id)}
                className='mega-dropdown-panel-link'
                onClick={onClose}
              >
                {sub.name}
              </Link>
            ))}
            {!activeChild?.children?.length && <div className='mega-dropdown-empty'>No subcategories available</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaDropdown
