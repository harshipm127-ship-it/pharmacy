import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Medicines.css'

const bodyParts = [
  'Head',
  'Eyes',
  'Ears',
  'Nose',
  'Mouth',
  'Teeth',
  'Heart',
  'Lungs',
  'Stomach',
  'Liver',
  'Kidneys',
  'Bones',
  'Joints',
  'Skin'
]

const medicinesByBodyPart = {
  Head: ['Paracetamol', 'Ibuprofen', 'Caffeine'],
  Eyes: ['Eye Drops', 'Loratadine'],
  Ears: ['Ear Drops', 'Pain Relief Gel'],
  Nose: ['Saline Nasal Spray', 'Pseudoephedrine'],
  Mouth: ['Mouthwash', 'Calcium Tablets'],
  Teeth: ['Vitamin D', 'Pain Relief Gel'],
  Heart: ['Aspirin', 'Atorvastatin'],
  Lungs: ['Salbutamol', 'Budesonide'],
  Stomach: ['Omeprazole', 'Pantoprazole'],
  Liver: ['Silymarin', 'Ursodeoxycholic Acid'],
  Kidneys: ['Allopurinol', 'Losartan'],
  Bones: ['Calcium + Vitamin D', 'Glucosamine'],
  Joints: ['Ibuprofen', 'Vitamin B12'],
  Skin: ['Betadine', 'Hydrocortisone']
}

function BodyParts() {
  const [selectedPart, setSelectedPart] = useState('Head')
  const medicines = medicinesByBodyPart[selectedPart] || []

  return (
    <section className='medicine-page'>
      <div className='breadcrumb-row'>
        <Link to='/'>Home</Link>
        <span>›</span>
        <Link to='/medicines'>Medicines</Link>
        <span>›</span>
        <span>Medicines for Body Parts</span>
      </div>

      <div className='medicine-page-header'>
        <div>
          <h1>Medicines for Body Parts</h1>
          <p>Select a body part below to see medicines that support that area.</p>
        </div>
      </div>

      <div className='category-grid'>
        {bodyParts.map((part) => (
          <button
            key={part}
            type='button'
            className={part === selectedPart ? 'category-card active' : 'category-card'}
            onClick={() => setSelectedPart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      <div className='section-panel'>
        <h2>{selectedPart} Medicines</h2>
        <div className='medicine-grid'>
          {medicines.map((medicine) => (
            <Link key={medicine} to={`/products/${medicine.replace(/\s+/g, '-').toLowerCase()}`} className='medicine-link'>
              {medicine}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BodyParts
