import React, { useEffect, useState } from 'react'
import { getAllContainers, updateContainerStatus } from '../services/containerApi'

const STATUS_STEPS = [
  'Order Placed',
  'Under Manufacturing',
  'Under Inspection',
  'Under Packing',
  'Transportation to Shipping Port / Airport',
  'Goods Under Stuffing',
  'Container Loaded',
  'Under Shipment',
  'Arrival Port Added',
  'Custom Clearance',
  'Under Transportation',
  'Under Delivery',
  'Delivered'
]

const AdminTracking = () => {
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchContainers()
  }, [])

  const fetchContainers = async () => {
    try {
      setLoading(true)
      const result = await getAllContainers()
      if (result.success) {
        setContainers(result.containers)
      }
    } catch (error) {
      console.error('Error fetching containers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)
      const result = await updateContainerStatus(selectedContainer._id, {
        status: newStatus,
        notes,
        location
      })

      if (result.success) {
        setShowStatusModal(false)
        fetchContainers()
        setSelectedContainer(null)
        setNewStatus('')
        setNotes('')
        setLocation('')
      } else {
        alert(result.message || 'Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setUpdating(false)
    }
  }

  const openStatusModal = (container) => {
    setSelectedContainer(container)
    setNewStatus(container.currentStatus)
    setShowStatusModal(true)
  }

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tracking Management</h1>
      </div>

      {/* Container Cards */}
      {loading ? (
        <div className="p-12 text-center text-gray-600">Loading...</div>
      ) : containers.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No containers found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {containers.map((container) => (
            <div key={container._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#F41703] to-[#F97316] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{container.containerNumber}</h3>
                    <p className="text-red-100 text-sm">{container.destination}</p>
                  </div>
                  <button
                    onClick={() => openStatusModal(container)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Current Status */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    container.currentStatus === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                    {container.currentStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Origin</p>
                    <p className="text-sm font-medium text-gray-800">{container.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="text-sm font-medium text-gray-800">{container.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ETD</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(container.etd)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(container.eta)}</p>
                  </div>
                </div>

                {/* Customers */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-2">Customers ({new Set(container.goods.map(g => g.userId?.toString())).size})</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(container.goods.map(g => g.userId?.firstName + ' ' + g.userId?.lastName))).map((name, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowStatusModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#F41703] to-[#F97316] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Update Status</h2>
                  <p className="text-red-100 text-sm mt-1 opacity-90">{selectedContainer.containerNumber}</p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleUpdateStatus} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Status *
                  </label>
                  <select
                    required
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  >
                    {STATUS_STEPS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="e.g., Shenzhen Port"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                    placeholder="Add any additional notes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-[#F41703] to-[#F97316] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#d10f02] hover:to-[#ea580c] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTracking
