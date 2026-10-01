import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { completeCustomerProfile } from '../../services/authService'
import './Register.css'

function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [addressType, setAddressType] = useState('HOME')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('India')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !country.trim() || !/^\d{5,10}$/.test(postalCode)) {
      setError('Complete all required profile and address fields.')
      return
    }
    if (!auth.isAuthenticated) {
      setError('Please verify your OTP before completing your profile.')
      return
    }

    setLoading(true)
    try {
      const response = await completeCustomerProfile({
        firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), addressType,
        addressLine1: addressLine1.trim(), addressLine2: addressLine2.trim() || null,
        landmark: landmark.trim() || null, city: city.trim(), state: state.trim(),
        postalCode: postalCode.trim(), country: country.trim(),
      })
      const profile = response?.data?.data
      if (profile) {
        auth.login({ ...(auth.customer || {}), fullName: `${profile.firstName} ${profile.lastName}`, phoneNumber: profile.phoneNumber })
        navigate('/')
      } else {
        setError('Unable to register. Please try again.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Profile completion failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='auth-page'>
      <div className='auth-card'>
        <div className='auth-copy'>
          <span className='auth-badge'>Complete your profile</span>
          <h1>Finish Registration</h1>
          <p>Add your account and default delivery address after OTP verification.</p>
        </div>

        <div className='auth-form'>
          <form onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>

            <label>
              Last Name
              <input
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
              />
            </label>

            <label>Address Type<select value={addressType} onChange={(e) => setAddressType(e.target.value)}><option value='HOME'>Home</option><option value='WORK'>Work</option><option value='OTHER'>Other</option></select></label>
            <label>Address Line 1<input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required /></label>
            <label>Address Line 2<input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} /></label>
            <label>Landmark<input value={landmark} onChange={(e) => setLandmark(e.target.value)} /></label>
            <label>City<input value={city} onChange={(e) => setCity(e.target.value)} required /></label>
            <label>State<input value={state} onChange={(e) => setState(e.target.value)} required /></label>
            <label>Postal Code<input inputMode='numeric' value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 10))} required /></label>
            <label>Country<input value={country} onChange={(e) => setCountry(e.target.value)} required /></label>

            {error && <p className='auth-error'>{error}</p>}

            <button className='cta-btn' type='submit' disabled={loading || !auth.isAuthenticated}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register
