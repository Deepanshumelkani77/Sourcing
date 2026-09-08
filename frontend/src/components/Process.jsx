import React from 'react'

const Process = () => {
  return (
    <div>
       {/* Our Sourcing Process Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Our Sourcing Process
            </h2>
            <div className="space-y-8">
              {/* Process Steps */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  01
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Requirement</h3>
                  <p className="text-gray-600">You tell us what you need.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  02
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Search</h3>
                  <p className="text-gray-600">We identify suitable suppliers/manufacturers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  03
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quotation</h3>
                  <p className="text-gray-600">Compare pricing, specifications and options.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  04
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sample / Verification</h3>
                  <p className="text-gray-600">Verify product or machinery specifications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  05
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Inspection</h3>
                  <p className="text-gray-600">Inspect before shipment where applicable.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F41703] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  06
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Shipping</h3>
                  <p className="text-gray-600">Coordinate logistics and delivery.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 font-medium">
                Requirement → Sourcing → Verification → Quality → Shipping → Delivery
              </p>
            </div>
          </div>
        </section>

    </div>
  )
}

export default Process
