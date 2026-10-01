import { Link } from 'react-router-dom'

function BeautyCategoryCard({ category }) {
  return (
    <Link to={category.route} className='beauty-category-circle-card'>
      <div className='beauty-category-icon'>
        <img src={category.image} alt={category.name} />
      </div>
      <span>{category.name}</span>
    </Link>
  )
}

export default BeautyCategoryCard
