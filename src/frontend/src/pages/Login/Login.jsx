import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { requestOtp, verifyOtp } from '../../services/authService'
import { AuthContext } from '../../context/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useContext(AuthContext)
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const redirectTo = location.state?.from || '/'

  useEffect(() => {
    if (countdown <= 0) {
      return undefined
    }

    const timer = setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const isValidMobile = (value) => /^\d{10}$/.test(value)

  const handleSendOtp = async () => {
    setError('')
    setMessage('')

    if (!isValidMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)
    try {
      const response = await requestOtp(mobile)
      setMessage(response.data.message || 'OTP sent successfully.')
      setOtpSent(true)
      setCountdown(30)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send OTP right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    setMessage('')

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit OTP.')
      return
    }

    setLoading(true)
    try {
      const response = await verifyOtp({ phoneNumber: mobile, otp })
      const data = response.data?.data
      if (!data?.accessToken) throw new Error('Invalid response from server')
      auth.login(data)
      navigate(data.newUser ? '/register' : redirectTo)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='auth-page'>
      <div className='auth-card'>
        <div className='auth-copy'>
          <span className='auth-badge'>Secure Login</span>
          <h1>Login with Mobile OTP</h1>
          <p>Enter your registered mobile number and verify it using the 6-digit OTP sent to your phone.</p>
        </div>

        <div className='auth-form'>
          {!otpSent ? (
            <>
              <label className='phone-field'>
                <span>Mobile Number</span>
                <div className='phone-input-row'>
                  <span className='country-code'>+91</span>
                  <input
                    type='tel'
                    inputMode='numeric'
                    placeholder='Enter 10-digit mobile number'
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  />
                </div>
              </label>

              {error && <p className='auth-error'>{error}</p>}
              {message && <p className='auth-message'>{message}</p>}

              <button className='cta-btn' type='button' onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </>
          ) : (
            <>
              <label className='phone-field'>
                <span>Enter OTP</span>
                <input
                  type='text'
                  inputMode='numeric'
                  placeholder='6-digit OTP'
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                />
              </label>

              {error && <p className='auth-error'>{error}</p>}
              {message && <p className='auth-message'>{message}</p>}

              <div className='auth-actions'>
                <button className='cta-btn' type='button' onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  className='secondary-btn'
                  type='button'
                  onClick={handleSendOtp}
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Login
