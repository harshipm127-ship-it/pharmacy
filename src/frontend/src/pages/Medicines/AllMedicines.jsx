import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Medicines.css'

const alphabet = ['All', ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))]

const medicineList = [
  { id: 201, name: 'Acetaminophen' },
  { id: 202, name: 'Aspirin' },
  { id: 203, name: 'Amoxicillin' },
  { id: 204, name: 'Atorvastatin' },
  { id: 205, name: 'Azithromycin' },
  { id: 206, name: 'Benadryl' },
  { id: 207, name: 'Betadine' },
  { id: 208, name: 'Brufen' },
  { id: 209, name: 'Cetirizine' },
  { id: 210, name: 'Diazepam' },
  { id: 211, name: 'Enalapril' },
  { id: 212, name: 'Fluconazole' },
  { id: 213, name: 'Glyceryl Trinitrate' },
  { id: 214, name: 'Hydrochlorothiazide' },
  { id: 215, name: 'Ibuprofen' },
  { id: 216, name: 'Loratadine' },
  { id: 217, name: 'Metformin' },
  { id: 218, name: 'Naproxen' },
  { id: 219, name: 'Omeprazole' },
  { id: 220, name: 'Pantoprazole' },
  { id: 221, name: 'Quetiapine' },
  { id: 222, name: 'Ranitidine' },
  { id: 223, name: 'Simvastatin' },
  { id: 224, name: 'Tramadol' },
  { id: 225, name: 'Vitamin B12' },
  { id: 226, name: 'Zincovit' }
]

function AllMedicines() {
  const [selectedLetter, setSelectedLetter] = useState('All')

  const filteredMedicines = useMemo(() => {
    if (selectedLetter === 'All') {
      return medicineList
    }

    return medicineList.filter((medicine) => medicine.name.startsWith(selectedLetter))
  }, [selectedLetter])

  return (
    <section className='medicine-page'>
      <div className='breadcrumb-row'>
        <Link to='/'>Home</Link>
        <span>›</span>
        <Link to='/medicines'>Medicines</Link>
        <span>›</span>
        <span>All Medicines</span>
      </div>

      <div className='medicine-page-header'>
        <div>
          <h1>Find Your Medicines</h1>
          <p>Use the alphabet filter to jump directly to medicine names and open product details fast.</p>
        </div>
      </div>

      <div className='alphabet-filter'>
        {alphabet.map((letter) => (
          <button
            key={letter}
            type='button'
            className={letter === selectedLetter ? 'alphabet-letter active' : 'alphabet-letter'}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className='letter-heading'>
        {selectedLetter === 'All' ? 'All Medicines' : selectedLetter}
      </div>

      <div className='medicine-grid'>
        {filteredMedicines.map((medicine) => (
          <Link key={medicine.id} to={`/products/${medicine.id}`} className='medicine-link'>
            {medicine.name}
          </Link>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className='empty-state'>No medicines found for this letter.</div>
      )}
    </section>
  )
}

export default AllMedicines
