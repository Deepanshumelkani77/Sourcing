import React from 'react'

const WhatWeDo = () => {
  return (
    <div>
        {/* What We Do Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service Cards */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Machinery Sourcing</h3>
                <p className="text-gray-600">Industrial machinery, manufacturing equipment and specialized machines.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Sourcing</h3>
                <p className="text-gray-600">Source products according to your specifications, quantity and budget.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Identification</h3>
                <p className="text-gray-600">Find and evaluate suitable manufacturers and suppliers.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Inspection</h3>
                <p className="text-gray-600">Quality checks and inspection before shipment.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">🚢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Logistics & Shipping</h3>
                <p className="text-gray-600">Coordinate transportation from China to the destination.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-200">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">End-to-End Sourcing</h3>
                <p className="text-gray-600">From requirement → supplier → production → inspection → shipping.</p>
              </div>
            </div>
          </div>
        </section>

    </div>
  )
}

export default WhatWeDo
