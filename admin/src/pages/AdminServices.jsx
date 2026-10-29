import React, { useEffect, useState } from 'react'
import { getAllServices, deleteService, createService, updateService, updateServiceStatus } from '../services/serviceApi'
import ServiceForm from '../components/ServiceForm'

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchServices()
  }, [searchTerm, filterPhase, filterStatus])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (filterPhase !== 'all') params.phaseId = filterPhase
      if (filterStatus !== 'all') params.status = filterStatus
      
      const result = await getAllServices(params)
      if (result.success) {
        // Flatten the services from phases
        const allServices = []
        if (result.phases) {
          result.phases.forEach(phase => {
            phase.services.forEach(service => {
              allServices.push({
                ...service,
                phaseId: phase.id,
                phaseName: phase.name,
                phaseNumber: phase.number
              })
            })
          })
        }
        // Sort by phaseNumber then by service number
        allServices.sort((a, b) => {
          const phaseOrder = parseInt(a.phaseNumber) - parseInt(b.phaseNumber)
          if (phaseOrder !== 0) return phaseOrder
          return parseInt(a.number) - parseInt(b.number)
        })
        setServices(allServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setShowModal(true)
  }

  const handleDelete = (service) => {
    setServiceToDelete(service)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const result = await deleteService(serviceToDelete._id)
      if (result.success) {
        setServices(services.filter(s => s._id !== serviceToDelete._id))
        setShowDeleteModal(false)
        setServiceToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleAddNew = () => {
    setEditingService(null)
    setShowModal(true)
  }

  const handleFormSubmit = async (serviceData) => {
    try {
      if (editingService) {
        const result = await updateService(editingService._id, serviceData)
        if (result.success) {
          await fetchServices()
          setShowModal(false)
          setEditingService(null)
        }
      } else {
        const result = await createService(serviceData)
        if (result.success) {
          await fetchServices()
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleStatusToggle = async (service) => {
    try {
      const newStatus = service.status === 'active' ? 'inactive' : 'active'
      const result = await updateServiceStatus(service._id, newStatus)
      if (result.success) {
        setServices(services.map(s => s._id === service._id ? { ...s, status: newStatus } : s))
      }
    } catch (error) {
      console.error('Error updating service status:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'inactive':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get unique phases
  const phases = [...new Set(services.map(s => s.phaseId))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Add New Service
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          />
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          >
            <option value="all">All Phases</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-600">
          Loading...
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No services found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Service Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#F41703] uppercase tracking-wider">
                    {service.phaseName}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status || 'active'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#F41703] to-[#F97316] text-white text-sm font-bold">
                    {service.number}
                  </span>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Service Details */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Included Items:</p>
                  <p className="text-sm text-gray-700">
                    {service.included?.length || 0} items
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{formatDate(service.createdAt)}</span>
                  <span>Order: {service.order || 0}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusToggle(service)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      service.status === 'active' 
                        ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {service.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
            </div>
            <div className="p-6">
              <ServiceForm 
                service={editingService} 
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowModal(false)
                  setEditingService(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Service</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{serviceToDelete.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setServiceToDelete(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminServices
