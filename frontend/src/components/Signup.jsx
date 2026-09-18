import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Signup = () => {
  const { showSignup, signupMode, closeSignup, setSignupMode } = useContext(AppContext)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ firstName: '', middleName: '', lastName: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [userCaptcha, setUserCaptcha] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpVerified, setEmailOtpVerified] = useState(false)
  const [mobileOtpSent, setMobileOtpSent] = useState(false)
  const [mobileOtp, setMobileOtp] = useState('')
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')

  const BRAND_COLOR = '#F41703'
  const SECONDARY_COLOR = '#F97316'

  useEffect(() => {
    if (!showSignup) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    generateCaptcha()
    return () => { document.body.style.overflow = original }
  }, [showSignup])

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setUserCaptcha('')
  }

  if (!showSignup) return null

  const close = () => closeSignup()

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value })

  const submitLogin = (e) => {
    e.preventDefault()
    setError('')

    if (userCaptcha !== captcha) {
      setError('Please enter the correct CAPTCHA code')
      generateCaptcha()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[0-9]+$/

    if (!emailRegex.test(loginData.email) && !phoneRegex.test(loginData.email)) {
      setError('Please enter a valid email address or phone number')
      return
    }

    console.log('login', loginData)
  }

  const handleSocialLogin = (provider) => {
    console.log('social login', provider)
    close()
  }

  const submitSignup = (e) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) {
      setError('Please enter a valid email address with @ and domain')
      return
    }

    const phoneRegex = /^\+?[0-9]+$/
    if (!phoneRegex.test(signupData.phone)) {
      setError('Please enter a valid phone number (numeric and + sign only)')
      return
    }

    console.log('signup', signupData)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setForgotError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail)) {
      setForgotError('Please enter a valid email address')
      return
    }

    console.log('Forgot password for:', forgotEmail)
    setForgotSuccess(true)
    setForgotEmail('')
  }

  const sendEmailOtp = () => {
    setOtpError('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) {
      setOtpError('Please enter a valid email address first')
      return
    }
    console.log('Sending OTP to email:', signupData.email)
    setEmailOtpSent(true)
  }

  const verifyEmailOtp = () => {
    setOtpError('')
    if (emailOtp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP')
      return
    }
    console.log('Verifying email OTP:', emailOtp)
    setEmailOtpVerified(true)
  }

  const sendMobileOtp = () => {
    setOtpError('')
    const phoneRegex = /^\+?[0-9]+$/
    if (!phoneRegex.test(signupData.phone)) {
      setOtpError('Please enter a valid phone number first')
      return
    }
    console.log('Sending OTP to mobile:', signupData.phone)
    setMobileOtpSent(true)
  }

  const verifyMobileOtp = () => {
    setOtpError('')
    if (mobileOtp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP')
      return
    }
    console.log('Verifying mobile OTP:', mobileOtp)
    setMobileOtpVerified(true)
  }

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={close}></div>

        <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left - marketing / toggle with sourcing image */}
          <div className="hidden md:flex flex-col relative overflow-hidden text-white p-8 gap-6">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F41703]/75 via-[#F41703]/80 to-[#F41703]/75" />
   

            <div className="relative flex-1">
              <h2 className="text-2xl font-semibold mb-2">Welcome to IndoChinaBridge</h2>
              <p className="text-sm text-red-100">Your trusted partner for sourcing machinery and products from China.</p>
            </div>

            {/* Promo card */}
            <div className="relative rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-yellow-300 uppercase mb-0.5">Exclusive Offer</p>
                <p className="text-sm font-semibold leading-snug">Get free sourcing<br />consultation today</p>
              </div>
              <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-[#F97316]">Get Started</span>
            </div>
          </div>

          {/* Right - forms */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{signupMode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
                <p className="text-sm text-gray-500 mt-1">{signupMode === 'login' ? 'Enter credentials to access your account securely.' : 'Fill the details below to create your account.'}</p>
              </div>
              <button onClick={close} aria-label="Close" className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {signupMode === 'login' ? (
              <form onSubmit={submitLogin} className="space-y-4">
                <div>
                  <input name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email address or phone number" required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                </div>
                <div>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={handleLoginChange} placeholder="Password" required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                    <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 012.223-3.607" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.88 9.88a3 3 0 104.24 4.24" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Enter CAPTCHA code" required className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                    <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg tracking-wider select-none border border-gray-300">
                      {captcha}
                    </div>
                    <button type="button" onClick={generateCaptcha} className="text-gray-500 hover:text-gray-700" aria-label="Refresh CAPTCHA">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button type="submit" className="w-full py-2 rounded-md bg-[#F41703] text-white font-semibold hover:bg-[#d31402] transition-colors">Login</button>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Don't have an account? <button type="button" onClick={() => setSignupMode('signup')} className="text-[#F41703] font-semibold">Sign up</button></span>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#F97316] hover:underline">Forgot password?</button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-3 my-3">
                    <hr className="flex-1 border-t border-gray-200" />
                    <span className="text-sm text-gray-400">or continue with</span>
                    <hr className="flex-1 border-t border-gray-200" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="flex-1 flex items-center justify-center gap-3 px-3 py-2 border rounded-md hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.2 9.23 3.15l6.9-6.9C36.6 2.48 30.63 0 24 0 14.73 0 6.95 5.24 3.02 12.9l7.99 6.2C12.99 13.12 17.98 9.5 24 9.5z"/>
                        <path fill="#34A853" d="M46.5 24c0-1.62-.14-3.19-.4-4.7H24v9.02h12.7c-.55 2.98-2.43 5.5-5.18 7.18l7.92 6.15C43.9 39.1 46.5 32.1 46.5 24z"/>
                        <path fill="#4A90E2" d="M10.99 28.1A14.9 14.9 0 0112 24c0-1.33-.2-2.62-.58-3.84L3.44 13.96A24 24 0 000 24c0 3.94.96 7.65 2.7 10.95l8.29-6.85z"/>
                        <path fill="#FBBC05" d="M24 48c6.63 0 12.6-2.19 17.27-5.96l-8.4-6.55C29.02 36.4 26.02 37.5 24 37.5c-6.02 0-11.01-3.62-12.99-8.14l-8 6.02C6.95 42.76 14.73 48 24 48z"/>
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="flex-1 flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-[#1877F2] text-white hover:brightness-95">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fill="#ffffff" d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.793.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.315h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z"/>
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={submitSignup} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input name="firstName" value={signupData.firstName} onChange={handleSignupChange} placeholder="First name *" required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400 text-sm" />
                  </div>
                  <div>
                    <input name="middleName" value={signupData.middleName} onChange={handleSignupChange} placeholder="Middle name" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400 text-sm" />
                  </div>
                  <div>
                    <input name="lastName" value={signupData.lastName} onChange={handleSignupChange} placeholder="Last name *" required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400 text-sm" />
                  </div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <input name="email" type="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email address *" required className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                    {!emailOtpVerified && (
                      <button type="button" onClick={sendEmailOtp} disabled={emailOtpSent} className="px-3 py-2 bg-[#F41703] text-white text-sm rounded-md hover:bg-[#d31402] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap">
                        {emailOtpSent ? 'OTP Sent' : 'Send OTP'}
                      </button>
                    )}
                    {emailOtpVerified && (
                      <div className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  {emailOtpSent && !emailOtpVerified && (
                    <div className="mt-2 flex gap-2">
                      <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" maxLength={6} className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400 text-sm" />
                      <button type="button" onClick={verifyEmailOtp} className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap">
                        Verify
                      </button>
                    </div>
                  )}
                  {otpError && <div className="text-sm text-red-600">{otpError}</div>}
                </div>
                <div>
                  <div className="flex gap-2">
                    <input name="phone" value={signupData.phone} onChange={handleSignupChange} placeholder="Phone number *" required className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                    {!mobileOtpVerified && (
                      <button type="button" onClick={sendMobileOtp} disabled={mobileOtpSent} className="px-3 py-2 bg-[#F41703] text-white text-sm rounded-md hover:bg-[#d31402] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap">
                        {mobileOtpSent ? 'OTP Sent' : 'Send OTP'}
                      </button>
                    )}
                    {mobileOtpVerified && (
                      <div className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-md flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  {mobileOtpSent && !mobileOtpVerified && (
                    <div className="mt-2 flex gap-2">
                      <input type="text" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" maxLength={6} className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400 text-sm" />
                      <button type="button" onClick={verifyMobileOtp} className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap">
                        Verify
                      </button>
                    </div>
                  )}
                  {otpError && <div className="text-sm text-red-600">{otpError}</div>}
                </div>
                <div>
                  <input name="password" type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F41703] outline-none placeholder-gray-400" />
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <button type="submit" className="w-full py-2 rounded-md bg-[#F41703] text-white font-semibold hover:bg-[#d31402] transition-colors">Create account</button>
                <div className="text-center text-sm text-gray-600">Already have an account? <button type="button" onClick={() => setSignupMode('login')} className="text-[#F41703] font-semibold">Sign in</button></div>

                <div className="mt-3">
                  <div className="flex items-center gap-3 my-3">
                    <hr className="flex-1 border-t border-gray-200" />
                    <span className="text-sm text-gray-400">or continue with</span>
                    <hr className="flex-1 border-t border-gray-200" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="flex-1 flex items-center justify-center gap-3 px-3 py-2 border rounded-md hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.2 9.23 3.15l6.9-6.9C36.6 2.48 30.63 0 24 0 14.73 0 6.95 5.24 3.02 12.9l7.99 6.2C12.99 13.12 17.98 9.5 24 9.5z"/>
                        <path fill="#34A853" d="M46.5 24c0-1.62-.14-3.19-.4-4.7H24v9.02h12.7c-.55 2.98-2.43 5.5-5.18 7.18l7.92 6.15C43.9 39.1 46.5 32.1 46.5 24z"/>
                        <path fill="#4A90E2" d="M10.99 28.1A14.9 14.9 0 0112 24c0-1.33-.2-2.62-.58-3.84L3.44 13.96A24 24 0 000 24c0 3.94.96 7.65 2.7 10.95l8.29-6.85z"/>
                        <path fill="#FBBC05" d="M24 48c6.63 0 12.6-2.19 17.27-5.96l-8.4-6.55C29.02 36.4 26.02 37.5 24 37.5c-6.02 0-11.01-3.62-12.99-8.14l-8 6.02C6.95 42.76 14.73 48 24 48z"/>
                      </svg>
                      <span className="text-sm">Google</span>
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="flex-1 flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-[#1877F2] text-white hover:brightness-95">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fill="#ffffff" d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.793.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.315h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z"/>
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForgotPassword(false)}></div>
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-8">
            <button onClick={() => setShowForgotPassword(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-sm text-gray-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition"
                  />
                </div>
                {forgotError && <div className="text-sm text-red-600">{forgotError}</div>}
                <button type="submit" className="w-full py-3 rounded-lg bg-[#F41703] text-white font-semibold hover:bg-[#d31402] transition">
                  Send Reset Link
                </button>
                <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition">
                  Back to Login
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Check Your Email</h3>
                <p className="text-sm text-gray-500">We've sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
                <button onClick={() => { setShowForgotPassword(false); setForgotSuccess(false) }} className="w-full py-3 rounded-lg bg-[#F41703] text-white font-semibold hover:bg-[#d31402] transition">
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Signup
