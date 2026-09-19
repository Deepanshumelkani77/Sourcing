import React from 'react'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Career from './pages/Career'
import { Routes, Route } from 'react-router-dom'
import AppContextProvider from './context/AppContext'
import { AuthProvider } from './context/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <AppContextProvider>
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
          </Routes>
          
           
        
          </main>

          <Footer />

        </div>
      </AppContextProvider>
    </AuthProvider>
  )
}

export default App
