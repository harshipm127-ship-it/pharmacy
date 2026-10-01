import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Medicines.css'

const healthIssues = [
  'Diabetes',
  'Fever',
  'Cold & Cough',
  'Heart Care',
  'Blood Pressure',
  'Asthma',
  'Thyroid',
  'Skin Care',
  'Kidney Care',
  'Liver Care',
  "Women's Health",
  "Men's Health"
]

const medicinesByIssue = {
  Diabetes: ['Metformin', 'Glipizide', 'Glyburide', 'Repaglinide'],
  Fever: ['Paracetamol', 'Crocin Advance', 'Ibuprofen'],
  'Cold & Cough': ['Cetirizine', 'Dextromethorphan', 'Ambroxol'],
  'Heart Care': ['Atorvastatin', 'Aspirin', 'Clopidogrel'],
  'Blood Pressure': ['Enalapril', 'Amlodipine', 'Losartan'],
  Asthma: ['Salbutamol', 'Budesonide', 'Montelukast'],
  Thyroid: ['Levothyroxine', 'Liothyronine'],
  'Skin Care': ['Betadine', 'Fluconazole', 'Hydrocortisone'],
  'Kidney Care': ['Allopurinol', 'Losartan', 'Aspirin'],
  'Liver Care': ['Ursodeoxycholic Acid', 'Silymarin'],
  "Women's Health": ['Iron Tablets', 'Calcium + Vitamin D', 'Folic Acid'],
  "Men's Health": ['Prostate Support', 'Zincovit', 'Omega 3']
}

function HealthIssues() {
  const [selectedIssue, setSelectedIssue] = useState('Diabetes')
  const medicines = medicinesByIssue[selectedIssue] || []

  return (
    <section className='medicine-page'>
      <div className='breadcrumb-row'>
        <Link to='/'>Home</Link>
        <span>›</span>
        <Link to='/medicines'>Medicines</Link>
        <span>›</span>
        <span>Medicines by Health Issues</span>
      </div>

      <div className='medicine-page-header'>
        <div>
          <h1>Medicines by Health Issues</h1>
          <p>Pick a health concern to see the most relevant medicines fast.</p>
        </div>
      </div>

      <div className='category-grid'>
        {healthIssues.map((issue) => (
          <button
            key={issue}
            type='button'
            className={issue === selectedIssue ? 'category-card active' : 'category-card'}
            onClick={() => setSelectedIssue(issue)}
          >
            {issue}
          </button>
        ))}
      </div>

      <div className='section-panel'>
        <h2>{selectedIssue} Medicines</h2>
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

export default HealthIssues
