import React from 'react'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Career from './pages/Career'
import { Routes, Route } from 'react-router-dom'
import AppContextProvider from './context/AppContext'

const App = () => {
  return (
    <AppContextProvider>
      <div className="min-h-screen">
        <Navbar />
        <Signup />
        
        {/* Home Page Content */}
        <main>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
        </Routes>
        
         
      
        
        </main>


      </div>
    </AppContextProvider>
  )
}

export default App
