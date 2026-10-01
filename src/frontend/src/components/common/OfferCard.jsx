function OfferCard({ offer }) {
  return (
    <div className='beauty-offer-card' style={{ background: offer.accent }}>
      <h3>{offer.title}</h3>
      <p>{offer.detail}</p>
    </div>
  )
}

export default OfferCard
