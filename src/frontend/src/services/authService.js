import apiClient from '../api/apiClient'

export const requestOtp = (phoneNumber) => apiClient.post('/auth/send-otp', { phoneNumber })
export const verifyOtp = (data) => apiClient.post('/auth/verify-otp', data)
export const completeCustomerProfile = (data) => apiClient.put('/customer/profile', data)
