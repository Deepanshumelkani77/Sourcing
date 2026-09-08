import React from 'react'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-2xl font-bold text-[#F41703]">
              <span className="text-gray-800">IndoChina</span>Bridge
            </div>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-[#F41703] transition-colors duration-200 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-[#F41703] transition-colors duration-200 font-medium">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-[#F41703] transition-colors duration-200 font-medium">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-[#F41703] transition-colors duration-200 font-medium">
              Blog
            </a>
            <a href="#" className="text-gray-700 hover:text-[#F41703] transition-colors duration-200 font-medium">
              Career
            </a>
          </div>

          {/* Right Side - Language Icon and Sign In */}
          <div className="flex items-center space-x-4">
            {/* Language Icon */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" title="Change Language">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>

            {/* Sign In Button */}
            <button className="bg-[#F41703] text-white px-4 py-2 rounded-lg hover:bg-[#d10f02] transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button (Hidden on Desktop) */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <div className="text-xl font-bold text-[#F41703]">
          <span className="text-gray-800">Mayank</span>Varshney
        </div>
        <button className="p-2 rounded-md hover:bg-gray-100">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
