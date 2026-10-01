import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Categories.css'
import CategoryCard from '../../components/CategoryCard/CategoryCard'

const tabGroups = {
  'Top Categories': [
    'Medicines', 'Devices', 'Personal Care', 'Surgicals', 'Sexual Wellness', 'Fitness',
    'Diabetes Care', 'Baby Care', 'Ayurveda', 'Home Essentials', 'Health Drinks', 'Elderly Care'
  ],
  Beauty: ['Skin Care', 'Hair Care', 'Face Wash', 'Sunscreen', 'Makeup', 'Lip Care', 'Body Care', 'Fragrances'],
  Wellness: ['Vitamins', 'Protein', 'Immunity Boosters', 'Weight Management', 'Nutrition', 'Herbal Supplements', 'Energy Drinks', "Women's Wellness", "Men's Wellness"]
}

const categoryImages = {
  Medicines: 'https://images.unsplash.com/photo-1580281657521-40f7a4a7b467?auto=format&fit=crop&w=500&q=80',
  Devices: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
  'Personal Care': 'https://images.unsplash.com/photo-1580910051074-81935d8d70f1?auto=format&fit=crop&w=500&q=80',
  Surgicals: 'https://images.unsplash.com/photo-1587502536263-703d6f7eef58?auto=format&fit=crop&w=500&q=80',
  'Sexual Wellness': 'https://images.unsplash.com/photo-1576675787460-819b4d7145a6?auto=format&fit=crop&w=500&q=80',
  Fitness: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80',
  'Diabetes Care': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=500&q=80',
  'Baby Care': 'https://images.unsplash.com/photo-1542343634-7ad6104d2026?auto=format&fit=crop&w=500&q=80',
  Ayurveda: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=80',
  'Home Essentials': 'https://images.unsplash.com/photo-1589571894960-20bbe2828d5f?auto=format&fit=crop&w=500&q=80',
  'Health Drinks': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
  'Elderly Care': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  'Skin Care': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
  'Hair Care': 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=500&q=80',
  'Face Wash': 'https://images.unsplash.com/photo-1571997478772-6db15814d638?auto=format&fit=crop&w=500&q=80',
  Sunscreen: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  Makeup: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=500&q=80',
  'Lip Care': 'https://images.unsplash.com/photo-1507783543949-9b54f19bc61b?auto=format&fit=crop&w=500&q=80',
  'Body Care': 'https://images.unsplash.com/photo-1556228724-4c7a78a2cf93?auto=format&fit=crop&w=500&q=80',
  Fragrances: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=500&q=80',
  Vitamins: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=500&q=80',
  Protein: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=500&q=80',
  'Immunity Boosters': 'https://images.unsplash.com/photo-1511447333011-2b03de8548eb?auto=format&fit=crop&w=500&q=80',
  'Weight Management': 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=500&q=80',
  Nutrition: 'https://images.unsplash.com/photo-1501004318641-7ad6104d2026?auto=format&fit=crop&w=500&q=80',
  'Herbal Supplements': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80',
  'Energy Drinks': 'https://images.unsplash.com/photo-1505904267569-f02eaeb45a4f?auto=format&fit=crop&w=500&q=80',
  "Women's Wellness": 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  "Men's Wellness": 'https://images.unsplash.com/photo-1511909525236-6c52e4610b38?auto=format&fit=crop&w=500&q=80'
}

function Categories() {
  const [activeTab, setActiveTab] = useState('Top Categories')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const dummyCategories = Object.keys(categoryImages).map((name, index) => ({
      id: index + 1,
      name,
      image: categoryImages[name]
    }))
    setCategories(dummyCategories)
  }, [])

  const filteredCategories = useMemo(() => {
    const group = tabGroups[activeTab] || []
    return categories.filter((category) =>
      group.includes(category.name) && category.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [activeTab, categories, search])

  const handleCategoryClick = (name) => {
    navigate(`/products?category=${encodeURIComponent(name)}`)
  }

  return (
    <section className='categories-page fade-page'>
      <div className='breadcrumb-bar'>
        <span className='breadcrumb-link' onClick={() => navigate('/')}>Home</span>
        <span>›</span>
        <span className='breadcrumb-current'>All Categories</span>
      </div>

      <div className='categories-header'>
        <div>
          <h1>All Categories</h1>
          <p>Browse organized healthcare categories and find products quickly.</p>
        </div>
        <div className='category-search'>
          <input
            type='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search categories...'
          />
        </div>
      </div>

      <div className='category-tabs'>
        {Object.keys(tabGroups).map((tab) => (
          <button
            key={tab}
            type='button'
            className={tab === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className='category-grid'>
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className='empty-state'>
          <p>No categories match your search.</p>
        </div>
      )}
    </section>
  )
}

export default Categories
