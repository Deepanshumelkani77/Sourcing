import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getAllContainers, deleteContainer, updateContainerStatus } from '../services/containerApi'
import CreateContainerModal from '../components/CreateContainerModal'

const STAGES = [
  { id: 'all', label: 'Total Containers', statuses: null },
  { id: 'pol', label: 'Shipment at POL', statuses: ['Goods Under Stuffing', 'Container Loaded'] },
  { id: 'transit', label: 'Shipment in-transit', statuses: ['Under Shipment'] },
  { id: 'pod', label: 'Shipment at POD', statuses: ['Arrival Port Added'] },
  { id: 'clearance', label: 'Under Custom Clearance', statuses: ['Custom Clearance'] },
  { id: 'delivery', label: 'Under Delivery', statuses: ['Under Transportation'] },
  { id: 'delivered', label: 'Delivered', statuses: ['Completed'] }
]

const AdminContainers = () => {
  const location = useLocation()
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [blNoFilter, setBlNoFilter] = useState('')
  const [containerNoFilter, setContainerNoFilter] = useState('')
  const [shipperFilter, setShipperFilter] = useState('')
  const [buyerFilter, setBuyerFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [stageCounts, setStageCounts] = useState({})

  useEffect(() => {
    // Check if navigation came from dashboard with filter
    if (location.state?.fromDashboard) {
      if (location.state.statusFilter === 'active') {
        // For active shipments, we don't set a filter - show all non-completed
        setStatusFilter('')
      } else if (location.state.statusFilter === 'completed') {
        setStatusFilter('Completed')
      }
    }
    // Check if navigation came from order page after status update
    if (location.state?.fromOrder) {
      // No specific filter needed, just show all containers
      console.log('Navigated from order page after status update')
    }
  }, [location.state])

  useEffect(() => {
    fetchStageCounts()
  }, [])

  useEffect(() => {
    fetchContainers()
  }, [blNoFilter, containerNoFilter, shipperFilter, buyerFilter, statusFilter, yearFilter, stageFilter])

  const fetchStageCounts = async () => {
    try {
      const result = await getAllContainers()
      if (result.success) {
        const counts = { all: result.containers.length }
        STAGES.forEach((stage) => {
          if (stage.statuses) {
            counts[stage.id] = result.containers.filter((c) =>
              stage.statuses.includes(c.currentStatus)
            ).length
          }
        })
        setStageCounts(counts)
      }
    } catch (error) {
      console.error('Error fetching stage counts:', error)
    }
  }

  const fetchContainers = async () => {
    try {
      setLoading(true)
      const params = {}
      if (blNoFilter) params.blNo = blNoFilter
      if (containerNoFilter) params.containerNo = containerNoFilter
      if (shipperFilter) params.shipper = shipperFilter
      if (buyerFilter) params.buyer = buyerFilter
      if (statusFilter && statusFilter !== 'active') params.status = statusFilter
      if (yearFilter) params.year = yearFilter

      const result = await getAllContainers(params)
      if (result.success) {
        // Filter locally for active and specific statuses
        let filteredContainers = result.containers
        if (statusFilter === 'active') {
          filteredContainers = result.containers.filter(c => c.currentStatus !== 'Completed')
        } else if (statusFilter) {
          filteredContainers = result.containers.filter(c => c.currentStatus === statusFilter)
        }
        const stage = STAGES.find((s) => s.id === stageFilter)
        if (stage?.statuses) {
          filteredContainers = filteredContainers.filter((c) =>
            stage.statuses.includes(c.currentStatus)
          )
        }
        setContainers(filteredContainers)
      }
    } catch (error) {
      console.error('Error fetching containers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this container?')) {
      try {
        const result = await deleteContainer(id)
        if (result.success) {
          fetchContainers()
          fetchStageCounts()
        } else {
          alert(result.message || 'Failed to delete container')
        }
      } catch (error) {
        alert('Error deleting container')
      }
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const result = await updateContainerStatus(selectedContainer._id, newStatus)
      if (result.success) {
        setShowStatusModal(false)
        setSelectedContainer(null)
        setNewStatus('')
        fetchContainers()
        fetchStageCounts()
      } else {
        alert(result.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Containers</h1>
          {location.state?.fromDashboard && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
                {location.state.statusFilter === 'active'
                  ? 'Viewing active shipments from dashboard'
                  : location.state.statusFilter === 'completed'
                  ? 'Viewing delivered containers from dashboard'
                  : 'Viewing all containers from dashboard'}
              </p>
              <button
                onClick={() => {
                  setStatusFilter('')
                  setYearFilter('')
                }}
                className="text-xs text-[#F41703] hover:text-[#d10f02] font-medium"
              >
                Clear Filter
              </button>
            </div>
          )}
          {location.state?.fromOrder && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
                Order status updated to "Transportation to Shipping Port/Airport" - Now manage the container
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#F41703] to-[#F97316] text-white px-6 py-2.5 rounded-lg font-semibold hover:from-[#d10f02] hover:to-[#ea580c] transition-all shadow-lg"
        >
          + Create Container
        </button>
      </div>

      {/* Stage Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {STAGES.map((stage) => {
          const isActive = stageFilter === stage.id
          return (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? 'border-[#F41703] bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-[#F41703]/50 hover:shadow-sm'
              }`}
            >
              <p className={`text-xs font-medium ${isActive ? 'text-red-100' : 'text-gray-500'}`}>
                {stage.label}
              </p>
              <p className="text-xl font-bold mt-1">
                {stageCounts[stage.id] ?? '–'}
              </p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill of Lading</label>
            <input
              type="text"
              placeholder="Search BL No..."
              value={blNoFilter}
              onChange={(e) => setBlNoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Container No.</label>
            <input
              type="text"
              placeholder="Search Container No..."
              value={containerNoFilter}
              onChange={(e) => setContainerNoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipper/Exporter</label>
            <input
              type="text"
              placeholder="Search Shipper..."
              value={shipperFilter}
              onChange={(e) => setShipperFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buyer</label>
            <input
              type="text"
              placeholder="Search Buyer..."
              value={buyerFilter}
              onChange={(e) => setBuyerFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active (Not Completed)</option>
              <option value="Goods Under Stuffing">Goods Under Stuffing</option>
              <option value="Container Loaded">Container Loaded</option>
              <option value="Under Shipment">Under Shipment</option>
              <option value="Arrival Port Added">Arrival Port Added</option>
              <option value="Custom Clearance">Custom Clearance</option>
              <option value="Under Transportation">Under Transportation</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            >
              <option value="">All Years</option>
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setBlNoFilter('')
                setContainerNoFilter('')
                setShipperFilter('')
                setBuyerFilter('')
                setStatusFilter('')
                setYearFilter('')
                setStageFilter('all')
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Container Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : containers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No containers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BL No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vessel Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Voyage No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">POL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ETD</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">POD</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ETA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Container No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seal No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transit Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. of Shippers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {containers.map((container, index) => (
                  <tr key={container._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.blNo || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.vesselName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.voyageNo || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.pol || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(container.etd)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.pod || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(container.eta)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.containerNo || container.containerNumber || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.sealNo || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.transitRoute || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{container.noOfShippers || container.shippers?.length || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        container.currentStatus === 'Completed' || container.currentStatus === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : container.currentStatus === 'Under Delivery'
                          ? 'bg-teal-100 text-teal-700'
                          : container.currentStatus === 'Under Transportation'
                          ? 'bg-cyan-100 text-cyan-700'
                          : container.currentStatus === 'Custom Clearance'
                          ? 'bg-indigo-100 text-indigo-700'
                          : container.currentStatus === 'Arrival Port Added'
                          ? 'bg-purple-100 text-purple-700'
                          : container.currentStatus === 'Under Shipment'
                          ? 'bg-pink-100 text-pink-700'
                          : container.currentStatus === 'Container Loaded'
                          ? 'bg-orange-100 text-orange-700'
                          : container.currentStatus === 'Goods Under Stuffing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {container.currentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {container.currentStatus !== 'Completed' && (
                          <button
                            onClick={() => {
                              setSelectedContainer(container)
                              setShowStatusModal(true)
                              setNewStatus(container.currentStatus)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Update Status
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(container._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CreateContainerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchContainers()
            fetchStageCounts()
          }}
        />
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedContainer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Update Container Status</h2>
                <button
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedContainer(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Container: <span className="font-medium">{selectedContainer.containerNo || selectedContainer.containerNumber}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              >
                <option value="Goods Under Stuffing">Goods Under Stuffing</option>
                <option value="Container Loaded">Container Loaded</option>
                <option value="Under Shipment">Under Shipment</option>
                <option value="Arrival Port Added">Arrival Port Added</option>
                <option value="Custom Clearance">Custom Clearance</option>
                <option value="Under Transportation">Under Transportation</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedContainer(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContainers
