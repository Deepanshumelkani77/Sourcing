import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Career from './pages/Career'
import ProductPage from './pages/ProductPage'
import Dashboard from './pages/Dashboard'
import Reviews from './pages/Reviews'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DataDeletion from './pages/DataDeletion'
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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Signup />

          {/* Home Page Content */}
          <main className="flex-1">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
          </Routes>



          </main>

          <Footer />

        </div>
      </AppContextProvider>
    </AuthProvider>
  )
}

export default App
