import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Services = () => {
  const { t } = useTranslation()

  const services = [
    {
      id: 'machinery',
      icon: '⚙️',
      titleKey: 'whatWeDo.machinerySourcing.title',
      bodyKey: 'whatWeDo.machinerySourcing.body'
    },
    {
      id: 'product',
      icon: '📦',
      titleKey: 'whatWeDo.productSourcing.title',
      bodyKey: 'whatWeDo.productSourcing.body'
    },
    {
      id: 'supplier',
      icon: '🔍',
      titleKey: 'whatWeDo.supplierIdentification.title',
      bodyKey: 'whatWeDo.supplierIdentification.body'
    },
    {
      id: 'quality',
      icon: '✅',
      titleKey: 'whatWeDo.qualityInspection.title',
      bodyKey: 'whatWeDo.qualityInspection.body'
    },
    {
      id: 'logistics',
      icon: '🚢',
      titleKey: 'whatWeDo.logisticsShipping.title',
      bodyKey: 'whatWeDo.logisticsShipping.body'
    },
    {
      id: 'endtoend',
      icon: '🎯',
      titleKey: 'whatWeDo.endToEndSourcing.title',
      bodyKey: 'whatWeDo.endToEndSourcing.body'
    }
  ]

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=700&fit=crop"
          alt="Our Services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F41703]/80 to-[#F97316]/80" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            {t('whatWeDo.title')}
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            {t('whatWeDo.subtitle')}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-[#F41703]/30"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F41703]/10 to-[#F97316]/10 flex items-center justify-center mb-6">
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t(service.titleKey)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(service.bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#F41703] to-[#F97316] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your sourcing journey?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Tell us what you need made, and we'll come back with suppliers, samples, and a real landed cost.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#F41703] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Get a free consultation
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Services
