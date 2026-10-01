function BrandSection({ brands }) {
  return (
    <section className='beauty-section'>
      <div className='beauty-section-header'>
        <h2>Trending Brands</h2>
      </div>
      <div className='beauty-brand-row'>
        {brands.map((brand) => (
          <div key={brand} className='beauty-brand-pill'>
            {brand}
          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandSection
