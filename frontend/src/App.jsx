import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Home Page Content */}
      <main className="pt-16">

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      
       
     
    
      </main>


    </div>
  )
}

export default App
