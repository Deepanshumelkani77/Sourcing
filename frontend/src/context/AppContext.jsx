import React, { createContext, useState } from 'react'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [showSignup, setShowSignup] = useState(false)
  const [signupMode, setSignupMode] = useState('login')
  const [user, setUser] = useState(null)

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
    setUser
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}

export default AppContextProvider
