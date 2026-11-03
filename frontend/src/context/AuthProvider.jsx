import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  getMe,
  logout as apiLogout
} from '../services/authApi'


export const AuthContext =
  createContext(null)

export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)


  const loadUser = async () => {
    // Only check auth if there's a token in localStorage
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const result = await getMe()
      if (result.success) {
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      // Silently handle auth errors - don't block page rendering
      setUser(null)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {

    loadUser()

  }, [])


  const logout = async () => {

    try {

      await apiLogout()
      localStorage.removeItem('auth_token')

    } finally {

      setUser(null)
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
