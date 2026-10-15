import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/axios'

const CRMDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/crm/dashboard')
      setStats(response.data.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch dashboard stats')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  const StatCard = ({ title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* CRM Sub-navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Link to="/crm" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Dashboard
          </Link>
          <Link to="/crm/leads" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Leads
          </Link>
          <Link to="/crm/customers" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Customers
          </Link>
          <Link to="/crm/followups" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Follow-ups
          </Link>
          <Link to="/crm/deals" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Deals
          </Link>
          <Link to="/crm/quotations" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Quotations
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats?.leads?.total || 0}
          subtitle={`${stats?.leads?.new || 0} new this month`}
          color="text-blue-600"
        />
        <StatCard
          title="Active Deals"
          value={stats?.deals?.active || 0}
          subtitle={`${stats?.deals?.won || 0} won`}
          color="text-green-600"
        />
        <StatCard
          title="Total Customers"
          value={stats?.customers?.total || 0}
          subtitle={`${stats?.customers?.active || 0} active`}
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.revenue?.total || 0).toLocaleString()}`}
          subtitle={`$${(stats?.revenue?.thisMonth || 0).toLocaleString()} this month`}
          color="text-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/crm/leads" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl">➕</span>
            <span className="font-medium">Add New Lead</span>
          </Link>
          <Link to="/crm/quotations" className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl">📄</span>
            <span className="font-medium">Create Quotation</span>
          </Link>
          <Link to="/crm/followups" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl">📅</span>
            <span className="font-medium">Schedule Follow-up</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {stats?.recent?.leads?.length > 0 ? (
              stats.recent.leads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{lead.customerName}</p>
                    <p className="text-sm text-gray-500">{lead.companyName || 'No company'}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lead.status === 'New'
                        ? 'bg-blue-100 text-blue-700'
                        : lead.status === 'Qualified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent leads</p>
            )}
          </div>
        </div>

        {/* Today's Follow-ups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Follow-ups</h3>
          <div className="space-y-3">
            {stats?.followUps?.upcoming?.length > 0 ? (
              stats.followUps.upcoming.map((followup) => (
                <div key={followup._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{followup.type}</p>
                    <p className="text-sm text-gray-500">
                      {followup.leadId?.customerName || followup.customerId?.customerName || 'Unknown'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      followup.status === 'Scheduled'
                        ? 'bg-yellow-100 text-yellow-700'
                        : followup.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {followup.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No follow-ups scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMDashboard
