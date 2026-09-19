import React, {
  createContext,
  useEffect,
  useState
} from 'react'

import {
  getMe,
  logout as apiLogout
} from '../services/authApi'


export const AuthContext =
  createContext(null)


export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)


  const loadUser = async () => {

    try {

      const result =
        await getMe()

      if (result.success) {
        setUser(result.user)
      }

    } catch {

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
