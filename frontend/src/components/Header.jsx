import React from 'react'
import assets from '../assets/assets'

const Header = () => {
  return (
    <section className="bg-gradient-to-r from-red-50 to-orange-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              SOURCE FROM CHINA.
              <br />
              BUILD YOUR BUSINESS.
            </h1>
            <p className="text-xl md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              We help businesses source machinery, products and manufacturing solutions from trusted suppliers in China and deliver them to India and global markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-[#F41703] text-white px-8 py-3 rounded-lg hover:bg-[#d10f02] transition-colors duration-200 font-medium shadow-lg hover:shadow-xl">
                Get a Sourcing Quote
              </button>
              <button className="bg-white text-[#F41703] px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl border-2 border-[#F41703]">
                Explore Our Services
              </button>
            </div>
     
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={assets.header1} 
                alt="Sourcing from China to Global Markets" 
                className="w-full h-auto rounded-xl object-cover"
                style={{ minHeight: '300px', backgroundColor: '#f3f4f6' }}
                onError={(e) => {
                  // Fallback to a placeholder image if header1.jpg doesn't exist
                  e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
