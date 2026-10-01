import { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import cartService from '../../services/cartService'
import { headerNavItems, headerMenuData } from '../../data/headerMenuConfig'
import MegaMenu from '../common/MegaMenu'
import MegaDropdown from '../common/MegaDropdown'
import WellnessMegaMenu from '../common/WellnessMegaMenu'
import AddressModal from '../common/AddressModal'
import { AuthContext } from '../../context/AuthContext'

function Layout({ children }) {
  const [cartCount, setCartCount] = useState(cartService.getCartCount())
  const auth = useContext(AuthContext)
  const [openMenuKey, setOpenMenuKey] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem('selected_delivery_address') || 'null')
    } catch {
      return null
    }
  })
  const menuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(cartService.getCartCount())
    }

    syncCartCount()
    window.addEventListener('cart-updated', syncCartCount)

    return () => window.removeEventListener('cart-updated', syncCartCount)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuKey(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!openMenuKey) {
      return
    }

    const currentMenuKey = headerNavItems.find(
      (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
    )?.menuKey

    if (currentMenuKey !== openMenuKey) {
      setOpenMenuKey(null)
    }
  }, [location.pathname, openMenuKey])

  useEffect(() => {
    const handleDeliveryAddressChanged = (event) => {
      setSelectedDelivery(event?.detail || null)
    }
    window.addEventListener('delivery-address-changed', handleDeliveryAddressChanged)
    return () => window.removeEventListener('delivery-address-changed', handleDeliveryAddressChanged)
  }, [])

  return (
    <div>
      <header className='site-header'>
        <div className='brand-lockup'>
          <div className='brand-logo'>+</div>
          <div>
            <span className='brand-title'>MedCart</span>
            <small className='brand-subtitle'>Trusted pharmacy care</small>
          </div>
        </div>

        <button type='button' className='location-pill' onClick={() => setShowAddressModal(true)}>
          📍 {selectedDelivery ? `Deliver to ${selectedDelivery.city || selectedDelivery.area || selectedDelivery.state || 'your location'} ${selectedDelivery.pincode || ''}`.trim() : 'Select Delivery Location'}
        </button>

        <label className='search-pill'>
          <span>🔎</span>
          <input type='text' placeholder='Search medicines, brands, and wellness' />
        </label>

        <div className='header-actions'>
          <Link className='cart-pill' to='/cart'>🛒 {cartCount}</Link>
          {auth?.isAuthenticated ? (
            <>
              <Link className='profile-btn' to='/profile'>
                {auth?.customer?.fullName ? auth.customer.fullName.split(' ')[0] : 'Profile'}
              </Link>
              <button
                type='button'
                className='profile-btn'
                onClick={() => {
                  auth.logout()
                  navigate('/login')
                }}
                style={{ background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className='profile-btn' to='/login'>Login</Link>
          )}
        </div>
      </header>

      <nav className='sub-nav' ref={menuRef}>
        {headerNavItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
          const isOpen = openMenuKey === item.menuKey
          const menu = headerMenuData[item.menuKey]
          const isBeautyMega = item.menuKey === 'beauty'
          const isWellnessMega = item.menuKey === 'wellness'
          const isMegaMenu = isBeautyMega || isWellnessMega

          return (
            <div key={item.key} className='sub-nav-item'>
              {isMegaMenu ? (
                <button
                  type='button'
                  className={`sub-nav-link sub-nav-button ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (openMenuKey === item.menuKey) {
                      setOpenMenuKey(null)
                      return
                    }
                    setOpenMenuKey(item.menuKey)
                    navigate(item.to)
                  }}
                  onMouseEnter={() => setOpenMenuKey(item.menuKey)}
                  onFocus={() => setOpenMenuKey(item.menuKey)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  <span className='chevron'>▾</span>
                </button>
              ) : (
                <NavLink
                  to={item.to}
                  onClick={() => setOpenMenuKey(null)}
                  className={({ isActive: navIsActive }) =>
                    navIsActive || isActive ? 'sub-nav-link active' : 'sub-nav-link'
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              )}

              {menu && (
                isBeautyMega ? (
                  <MegaDropdown
                    rootCategory={{ name: item.label, slug: item.categorySlug || item.key, children: menu.children }}
                    isOpen={isOpen}
                    onClose={() => setOpenMenuKey(null)}
                  />
                ) : isWellnessMega ? (
                  <WellnessMegaMenu isOpen={isOpen} onClose={() => setOpenMenuKey(null)} />
                ) : (
                  <MegaMenu menu={menu} isOpen={isOpen} onClose={() => setOpenMenuKey(null)} />
                )
              )}
            </div>
          )
        })}
      </nav>

      <main>{children}</main>
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(address) => {
          if (address) setSelectedDelivery(address)
          setShowAddressModal(false)
        }}
      />

      <footer className='site-footer'>
        <div className='footer-grid'>
          <div>
            <h3>MedCart</h3>
            <p>Trusted care for prescriptions, pharmacy essentials, and everyday wellness.</p>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to='/'>About Us</Link></li>
              <li><Link to='/'>Careers</Link></li>
              <li><Link to='/'>Contact</Link></li>
              <li><Link to='/'>Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4>Customer Service</h4>
            <ul>
              <li><Link to='/'>FAQs</Link></li>
              <li><Link to='/'>Track Order</Link></li>
              <li><Link to='/'>Return Policy</Link></li>
              <li><Link to='/'>Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul>
              <li><Link to='/'>Privacy Policy</Link></li>
              <li><Link to='/'>Terms & Conditions</Link></li>
              <li><Link to='/'>Prescription Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href='mailto:support@medcart.com'>support@medcart.com</a></li>
              <li><a href='tel:+919999999999'>+91 99999 99999</a></li>
              <li>401, Wellness Avenue, Mumbai</li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              <li><a href='https://facebook.com' target='_blank' rel='noreferrer'>Facebook</a></li>
              <li><a href='https://instagram.com' target='_blank' rel='noreferrer'>Instagram</a></li>
              <li><a href='https://twitter.com' target='_blank' rel='noreferrer'>Twitter</a></li>
              <li><a href='https://linkedin.com' target='_blank' rel='noreferrer'>LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className='footer-bottom'>MedCart © 2026 • All rights reserved.</div>
      </footer>
    </div>
  )
}

export default Layout
