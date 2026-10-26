import React, { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Footer from './components/Footer'
import Chatbot from './components/chatbot/Chatbot'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Career from './pages/Career'
import ProductPage from './pages/ProductPage'
import Dashboard from './pages/Dashboard'
import Reviews from './pages/Reviews'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DataDeletion from './pages/DataDeletion'
import AuthCallback from './pages/AuthCallback'
import India from './pages/India'
import China from './pages/China'
import MiddleEast from './pages/MiddleEast'
import SoutheastAsia from './pages/SoutheastAsia'
import Europe from './pages/Europe'
import Africa from './pages/Africa'
import { Routes, Route } from 'react-router-dom'
import AppContextProvider from './context/AppContext'
import { AuthProvider } from './context/AuthProvider'
import './i18n'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  return (
    <AuthProvider>
      <AppContextProvider>
        <ScrollToTop />
        <Routes>
          {/* Main website routes with Navbar and Footer */}
          <Route
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <Signup />
                <main className="flex-1">
                  <Outlet />
                </main>
                <Footer />
                <Chatbot />
              </div>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/countries/india" element={<India />} />
            <Route path="/countries/africa" element={<Africa />} />
            <Route path="/countries/china" element={<China />} />
            <Route path="/countries/middle-east" element={<MiddleEast />} />
            <Route path="/countries/southeast-asia" element={<SoutheastAsia />} />
            <Route path="/countries/europe" element={<Europe />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Route>
        </Routes>
      </AppContextProvider>
    </AuthProvider>
  )
}

export default App
