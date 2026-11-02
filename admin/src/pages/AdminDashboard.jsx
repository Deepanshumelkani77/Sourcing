import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllContainers } from '../services/containerApi'
import { getAllUsers } from '../services/userApi'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [containers, setContainers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [yearFilter, setYearFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [containersResult, usersResult] = await Promise.all([
          getAllContainers(yearFilter ? { year: yearFilter } : {}),
          getAllUsers()
        ])
        if (containersResult.success) {
          setContainers(containersResult.containers)
        }
        if (usersResult.success) {
          setCustomers(usersResult.users)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [yearFilter])

  const stats = {
    totalContainers: containers.length,
    activeShipments: containers.filter(c => c.currentStatus !== 'Completed').length,
    delivered: containers.filter(c => c.currentStatus === 'Completed').length,
    totalCustomers: customers.length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          onClick={() => navigate('/containers', { state: { fromDashboard: true } })}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
          title="View all containers"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Total Containers</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-blue-700 transition-colors">{stats.totalContainers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/containers', { state: { fromDashboard: true, statusFilter: 'active' } })}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-300 group"
          title="View all active shipments"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">Active Shipments</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-green-700 transition-colors">{stats.activeShipments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/containers', { state: { fromDashboard: true, statusFilter: 'completed' } })}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all duration-300 group"
          title="View all delivered containers"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Delivered</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-purple-700 transition-colors">{stats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/customers', { state: { fromDashboard: true } })}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-300 group"
          title="View all customers"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 group-hover:text-orange-600 transition-colors">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-orange-700 transition-colors">{stats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Containers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Recent Containers</h2>
          <button className="text-sm text-[#F41703] hover:text-[#d10f02] font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Container No.</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customers</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {containers.slice(0, 5).map((container) => (
                <tr key={container._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{container.containerNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{container.destination}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Set(container.goods.map(g => g.userId?.toString())).size}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      container.currentStatus === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : container.currentStatus === 'Goods Under Stuffing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {container.currentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {container.eta ? new Date(container.eta).toLocaleDateString() : 'TBD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
