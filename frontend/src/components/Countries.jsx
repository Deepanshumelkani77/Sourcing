import React from 'react'

const CountryCard = ({ name, flag, image, description }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-[#F41703]">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

const Countries = () => {
  const countries = [
    {
      name: 'China',
      flag: '🇨🇳',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Source from manufacturing hubs and suppliers across China.'
    },
    {
      name: 'India',
      flag: '🇮🇳',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Deliver to Indian markets with streamlined logistics.'
    },
    {
      name: 'Middle East',
      flag: '🌍',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Expand your reach across Middle Eastern markets.'
    },
    {
      name: 'Southeast Asia',
      flag: '🌏',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Connect with growing markets in Southeast Asia.'
    },
    {
      name: 'Europe',
      flag: '🇪🇺',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Reach European markets with reliable sourcing.'
    }
  ]

  return (
    <div>
          {/* China to Global Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-orange-100 text-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              From China to Your Business
            </h2>
            <p className="text-lg md:text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
              Global sourcing capabilities that connect you to markets worldwide
            </p>
            
            {/* Country Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {countries.map((country, index) => (
                <CountryCard key={index} {...country} />
              ))}
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 inline-block">
              <p className="text-xl md:text-2xl font-medium text-gray-900">
                One sourcing partner. Multiple markets.
              </p>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Countries
