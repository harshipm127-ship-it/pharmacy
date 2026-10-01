import { useEffect, useState } from 'react'

function BannerSlider({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [{ title: 'Enjoy beauty essentials', subtitle: 'Discover curated products for glow and care.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' }]

  useEffect(() => {
    if (safeSlides.length === 0) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % safeSlides.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [safeSlides.length])

  const moveSlide = (direction) => {
    setCurrentIndex((index) => {
      if (safeSlides.length === 0) {
        return 0
      }

      if (direction === 'next') {
        return (index + 1) % safeSlides.length
      }

      return (index - 1 + safeSlides.length) % safeSlides.length
    })
  }

  const currentSlide = safeSlides[currentIndex] || safeSlides[0]

  return (
    <div className='beauty-slider'>
      <button type='button' className='slider-arrow left' onClick={() => moveSlide('prev')} aria-label='Previous slide'>‹</button>
      <div className='beauty-slider-track'>
        <img src={currentSlide.image} alt={currentSlide.title || 'Beauty slide'} className='beauty-slider-image' />
        <div className='beauty-slider-copy'>
          <span>Beauty Picks</span>
          <h2>{currentSlide.title}</h2>
          <p>{currentSlide.subtitle}</p>
        </div>
      </div>
      <button type='button' className='slider-arrow right' onClick={() => moveSlide('next')} aria-label='Next slide'>›</button>
    </div>
  )
}

export default BannerSlider
