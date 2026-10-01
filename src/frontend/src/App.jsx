import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Products from './pages/Products/Products'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Orders from './pages/Orders/Orders'
import Profile from './pages/Profile/Profile'
import Categories from './pages/Categories/Categories'
import AllMedicines from './pages/Medicines/AllMedicines'
import HealthIssues from './pages/Medicines/HealthIssues'
import BodyParts from './pages/Medicines/BodyParts'
import BeautyPage from './pages/Beauty/BeautyPage'
import WellnessPage from './pages/Wellness/WellnessPage'
import LandingPage from './pages/LandingPage/LandingPage'
import CategoryPage from './pages/Category/CategoryPage'
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import LoginModal from './components/common/LoginModal'
import AdminRouter from './admin/routes/AdminRouter'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const appContent = (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/products' element={<Products />} />
      <Route path='/products/:id' element={<ProductDetails />} />
      <Route path='/medicine' element={<AllMedicines />} />
      <Route path='/medicines' element={<AllMedicines />} />
      <Route path='/medicines/health-issues' element={<HealthIssues />} />
      <Route path='/medicines/body-parts' element={<BodyParts />} />
      <Route path='/beauty' element={<BeautyPage />} />
      <Route path='/beauty/:categorySlug' element={<CategoryPage />} />
      <Route path='/wellness' element={<WellnessPage />} />
      <Route path='/wellness/:categorySlug' element={<CategoryPage />} />
      <Route path='/category/:categorySlug' element={<CategoryPage />} />
      <Route path='/offers' element={<LandingPage />} />
      <Route path='/offers/*' element={<LandingPage />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/orders' element={<Orders />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/admin/*' element={<AdminRouter />} />
    </Routes>
  )

  return (
    <AuthProvider>
      {isAdminRoute ? appContent : <Layout>{appContent}</Layout>}
      <LoginModal />
    </AuthProvider>
  )
}

export default App
