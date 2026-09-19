import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})


export const sendSignupOTP = async (email) => {
  const response = await authApi.post(
    '/auth/send-signup-otp',
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
    '/auth/verify-signup-otp',
    {
      email,
      otp
    }
  )

  return response.data
}


export const signup = async (data) => {
  const response = await authApi.post(
    '/auth/signup',
    data
  )

  return response.data
}


export const login = async (
  email,
  password
) => {
  const response = await authApi.post(
    '/auth/login',
    {
      email,
      password
    }
  )

  return response.data
}


export const logout = async () => {
  const response = await authApi.post(
    '/auth/logout'
  )

  return response.data
}


export const getMe = async () => {
  const response = await authApi.get(
    '/auth/me'
  )

  return response.data
}


export const forgotPassword = async (
  email
) => {
  const response = await authApi.post(
    '/auth/forgot-password',
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
    `/auth/reset-password/${token}`,
    {
      password
    }
  )

  return response.data
}


export default authApi
