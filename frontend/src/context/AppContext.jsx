import React, { createContext, useState, useEffect } from 'react'
import { getMe } from '../services/authApi'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [showSignup, setShowSignup] = useState(false)
  const [signupMode, setSignupMode] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await getMe()
      if (response.success) {
        setUser(response.user)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const openSignup = () => {
    setSignupMode('login')
    setShowSignup(true)
  }
  
  const openSignupMode = () => {
    setSignupMode('signup')
    setShowSignup(true)
  }
  
  const closeSignup = () => setShowSignup(false)

  const value = {
    showSignup,
    signupMode,
    setSignupMode,
    openSignup,
    openSignupMode,
    closeSignup,
    user,
    setUser,
    loading
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}

export default AppContextProvider
