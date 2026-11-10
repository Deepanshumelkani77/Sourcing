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
    // The backend sets an httpOnly auth cookie on login, so always verify
    // the session - guests simply get a 401 and stay logged out.
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
