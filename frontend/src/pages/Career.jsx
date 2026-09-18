import React, { useState } from 'react'

const BRAND_COLOR = '#F41703'

const ChevronDivider = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const JOBS = [
  {
    id: 1,
    title: 'Sourcing Specialist',
    department: 'Operations',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Lead supplier identification, negotiation, and quality assurance for machinery and product sourcing from China.',
    requirements: [
      'Experience in international trade or sourcing',
      'Knowledge of Chinese manufacturing ecosystem',
      'Strong negotiation and communication skills',
      'Fluency in English and Mandarin (preferred)',
      'Willingness to travel to China'
    ]
  },
  {
    id: 2,
    title: 'Quality Control Engineer',
    department: 'Quality Assurance',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Conduct pre-shipment inspections, quality audits, and ensure compliance with client specifications.',
    requirements: [
      'Engineering background (Mechanical/Industrial preferred)',
      'Experience in quality control and inspection',
      'Knowledge of international quality standards',
      'Attention to detail and strong analytical skills',
      'Ability to create detailed inspection reports'
    ]
  },
  {
    id: 3,
    title: 'Logistics Coordinator',
    department: 'Supply Chain',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Manage shipping coordination, customs documentation, and ensure timely delivery of sourced products.',
    requirements: [
      'Experience in international logistics and freight forwarding',
      'Knowledge of customs procedures and documentation',
      'Strong organizational and tracking skills',
      'Ability to work under tight deadlines',
      'Proficiency in logistics software'
    ]
  },
  {
    id: 4,
    title: 'Business Development Executive',
    department: 'Sales',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Identify new business opportunities, build client relationships, and expand our sourcing services portfolio.',
    requirements: [
      'Experience in B2B sales or business development',
      'Strong networking and relationship-building skills',
      'Understanding of international trade and sourcing',
      'Excellent presentation and communication skills',
      'Target-driven mindset'
    ]
  }
]

const BENEFITS = [
  {
    icon: '💰',
    title: 'Competitive Salary',
    description: 'Industry-leading compensation with performance bonuses'
  },
  {
    icon: '🏥',
    title: 'Health Insurance',
    description: 'Comprehensive medical coverage for you and your family'
  },
  {
    icon: '✈️',
    title: 'Travel Opportunities',
    description: 'International travel to China and supplier visits'
  },
  {
    icon: '📈',
    title: 'Growth & Learning',
    description: 'Continuous training and career advancement opportunities'
  },
  {
    icon: '🌍',
    title: 'Global Exposure',
    description: 'Work with international clients and suppliers'
  },
  {
    icon: '⚖️',
    title: 'Work-Life Balance',
    description: 'Flexible working hours and supportive environment'
  }
]

const VALUES = [
  {
    title: 'Integrity',
    description: 'We believe in honest communication and transparent business practices with clients and suppliers alike.'
  },
  {
    title: 'Excellence',
    description: 'We strive for the highest quality in everything we do, from supplier selection to final delivery.'
  },
  {
    title: 'Innovation',
    description: 'We continuously improve our processes and embrace new technologies to serve our clients better.'
  },
  {
    title: 'Collaboration',
    description: 'We work as a team across borders and time zones to deliver exceptional results.'
  }
]

const Career = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setIsModalOpen(false)
      setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' })
    }, 3000)
  }

  const openModal = (position) => {
    setFormData(prev => ({ ...prev, position }))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' })
  }

  return (
    <div className="w-full bg-white">
      {/* ---- Hero Section ---- */}
      <div className="relative w-full h-[350px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=800&fit=crop"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, rgba(244,23,3,0.15), rgba(244,23,3,0.2))` }} />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>Home</span>
            <ChevronDivider />
            <span className="text-white font-medium">Careers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            Build Your Career with Us
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            Join a dynamic team connecting global businesses with quality manufacturing. Grow your career in international trade and sourcing.
          </p>
        </div>
      </div>

   
      {/* ---- Open Positions ---- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold mb-3" style={{ color: BRAND_COLOR }}>
              Open Positions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Job Openings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our current opportunities and find the perfect role to advance your career.
            </p>
          </div>

          <div className="space-y-4">
            {JOBS.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="px-6 py-2.5 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap"
                      style={{
                        backgroundColor: selectedJob === job.id ? '#e5e7eb' : BRAND_COLOR,
                        color: selectedJob === job.id ? '#374151' : 'white'
                      }}
                    >
                      {selectedJob === job.id ? 'Close' : 'View Details'}
                    </button>
                  </div>

                  {selectedJob === job.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND_COLOR }} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => openModal(job.title)}
                        className="mt-6 px-6 py-2.5 rounded-lg font-medium text-white transition-colors duration-300"
                        style={{ backgroundColor: BRAND_COLOR }}
                      >
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Application Modal ---- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Apply for Position
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 48 hours.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <select
                      id="position"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleChange('position')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="">Select a position</option>
                      {JOBS.map(job => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                      <option value="General Application">General Application</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange('experience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition text-sm"
                    placeholder="e.g., 2-4 years"
                  />
                </div>

                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    required
                    rows={5}
                    value={formData.coverLetter}
                    onChange={handleChange('coverLetter')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition resize-none text-sm"
                    placeholder="Tell us about yourself, your experience, and why you'd like to join our team..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg text-sm"
                  style={{ backgroundColor: BRAND_COLOR }}
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    
    </div>
  )
}

export default Career
