import React, { createContext, useState } from 'react'

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [showSignup, setShowSignup] = useState(false)
  const [signupMode, setSignupMode] = useState('login')

  const openSignup = () => setShowSignup(true)
  const closeSignup = () => setShowSignup(false)

  const value = {
    showSignup,
    signupMode,
    setSignupMode,
    openSignup,
    closeSignup
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}

export default AppContextProvider
