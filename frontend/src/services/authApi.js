import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const authApi = axios.create({
  baseURL: `${API_URL}/api/user/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})


export const sendSignupOTP = async (email) => {
  const response = await authApi.post(
    '/send-signup-otp',
    {
      email
    }
  )

  return response.data
}


export const verifySignupOTP = async (
  email,
  otp
) => {
  const response = await authApi.post(
    '/verify-signup-otp',
    {
      email,
      otp
    }
  )

  return response.data
}


export const signup = async (data) => {
  const response = await authApi.post(
    '/signup',
    data
  )

  return response.data
}


export const login = async (
  email,
  password
) => {
  const response = await authApi.post(
    '/login',
    {
      email,
      password
    }
  )

  return response.data
}


export const logout = async () => {
  const response = await authApi.post(
    '/logout'
  )

  return response.data
}


export const getMe = async () => {
  const response = await authApi.get(
    '/me'
  )

  return response.data
}


export const forgotPassword = async (
  email
) => {
  const response = await authApi.post(
    '/forgot-password',
    {
      email
    }
  )

  return response.data
}


export const resetPassword = async (
  token,
  password
) => {
  const response = await authApi.post(
    `/reset-password/${token}`,
    {
      password
    }
  )

  return response.data
}


export default authApi
