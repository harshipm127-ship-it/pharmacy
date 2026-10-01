import './CategoryCard.css'

export default function CategoryCard({ category, onClick }) {
  return (
    <button type='button' className='category-card' onClick={onClick}>
      <div className='category-image-wrap'>
        <img src={category.image} alt={category.name} />
      </div>
      <span>{category.name}</span>
    </button>
  )
}
