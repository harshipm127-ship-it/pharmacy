import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function MegaMenu({ menu, isOpen, onClose }) {
  const [selectedItem, setSelectedItem] = useState(menu?.dropdownItems?.[0]?.label || '')

  const activeMenuItem = useMemo(() => {
    return menu?.dropdownItems?.find((item) => item.label === selectedItem) ?? menu?.dropdownItems?.[0]
  }, [menu, selectedItem])

  const handleSelect = (item) => {
    setSelectedItem(item.label)
    onClose()
  }

  if (!menu || !Array.isArray(menu.dropdownItems)) return null

  return (
    <div className={`mega-menu ${isOpen ? 'open' : ''}`}>
      <div className='mega-menu-shell'>
        <aside className='mega-menu-sidebar'>
          {menu.dropdownItems.map((item) => (
            <button
              key={item.label}
              type='button'
              className={`mega-menu-item ${selectedItem === item.label ? 'selected' : ''}`}
              onClick={() => setSelectedItem(item.label)}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <section className='mega-menu-content'>
          <div className='mega-menu-content-header'>
            <span>{activeMenuItem?.label}</span>
          </div>

          <div className='mega-menu-links'>
            {menu.dropdownItems.map((item) => (
              <Link key={item.label} className='mega-menu-link' to={item.route} onClick={() => handleSelect(item)}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MegaMenu
