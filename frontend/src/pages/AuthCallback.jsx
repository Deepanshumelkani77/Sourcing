import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (token) {
        // Store token in localStorage as fallback for cross-domain
        localStorage.setItem('auth_token', token)
        
        // Also try to set cookie
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`
        
        // Fetch user data using Authorization header instead of relying on cookie
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          })
          const data = await response.json()
          
          if (data.success && data.user) {
            setUser(data.user)
            navigate('/')
          } else {
            localStorage.removeItem('auth_token')
            navigate('/?error=auth_failed')
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          localStorage.removeItem('auth_token')
          navigate('/?error=auth_failed')
        }
      } else {
        navigate('/?error=no_token')
      }
    }

    handleCallback()
  }, [navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F41703] mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
