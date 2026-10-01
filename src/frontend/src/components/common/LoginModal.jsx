import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { requestOtp, verifyOtp } from '../../services/authService'
import './LoginModal.css'

export default function LoginModal() {
  const { showLogin, setShowLogin, login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [method, setMethod] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setShowLogin(false)
    }
    if (showLogin) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showLogin, setShowLogin])

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((current) => current - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('login-overlay')) {
      setShowLogin(false)
    }
  }

  const validateMobile = (value) => /^\d{10}$/.test(value)

  const handleSendOtp = async () => {
    setError('')
    setMessage('')

    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const response = await requestOtp(mobile)
      setMessage(response.data.message || 'OTP sent successfully.')
      setOtpSent(true)
      setCountdown(30)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    setMessage('')

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const response = await verifyOtp({ phoneNumber: mobile, otp })
      const data = response.data?.data
      if (data?.newUser) {
        login(data)
        setShowLogin(false)
        navigate('/register')
      } else if (data?.accessToken) {
        login(data)
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => setShowLogin(false)

  if (!showLogin) return null

  return (
    <div className='login-overlay' onMouseDown={handleOverlayClick}>
      <div className='login-modal' role='dialog' aria-modal='true'>
        <button className='modal-close' onClick={handleClose} aria-label='Close'>✕</button>
        <div className='modal-grid'>
          <div className='modal-left'>
            <h2>Login / Sign Up to Continue</h2>
            <div className='auth-tabs'>
              <button className={method === 'mobile' ? 'active' : ''} onClick={() => setMethod('mobile')}>Mobile</button>
              <button className={method === 'email' ? 'active' : ''} onClick={() => setMethod('email')}>Email</button>
            </div>

            {!otpSent ? (
              <div className='login-form'>
                {method === 'mobile' ? (
                  <>
                    <label className='mobile-input'>
                      <select defaultValue='+91' aria-label='Country code'>
                        <option value='+91'>+91</option>
                      </select>
                      <input
                        placeholder='Enter mobile number'
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      />
                    </label>
                    {error && <div className='error'>{error}</div>}
                    {message && <div className='success'>{message}</div>}
                    <div className='modal-actions'>
                      <button className='primary-btn' onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
                      <button className='secondary-btn' onClick={() => alert('Email login is not yet supported')}>
                        Continue with Email
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='login-form'>
                    <input placeholder='Enter email' disabled />
                    <div className='modal-actions'>
                      <button className='primary-btn' disabled>
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='otp-form'>
                <h3>Enter OTP</h3>
                <div className='otp-boxes'>
                  <input
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder='Enter 6-digit OTP'
                  />
                </div>
                {error && <div className='error'>{error}</div>}
                {message && <div className='success'>{message}</div>}
                <div className='modal-actions'>
                  <button className='primary-btn' onClick={handleVerifyOtp} disabled={loading}>{loading ? 'Verifying…' : 'Verify OTP'}</button>
                  <button className='secondary-btn' type='button' onClick={() => { if (countdown === 0) handleSendOtp() }}>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className='modal-right'>
            <div className='illustration'>
              <img src='https://images.unsplash.com/photo-1580281657521-40f7a4a7b467?auto=format&fit=crop&w=600&q=80' alt='health illustration' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
