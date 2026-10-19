import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthProvider'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminContainers from './pages/AdminContainers'
import AdminOrders from './pages/AdminOrders'
import AdminCustomers from './pages/AdminCustomers'
import AdminTracking from './pages/AdminTracking'
import AdminIssues from './pages/AdminIssues'
import AdminJobs from './pages/AdminJobs'
import AdminContactSubmissions from './pages/AdminContactSubmissions'
import AdminQuotations from './pages/AdminQuotations'
import AdminReviews from './pages/AdminReviews'
import Login from './pages/Login'
import CRMDashboard from './pages/crm/CRMDashboard'
import CRMLeads from './pages/crm/Leads'
import CRMCustomers from './pages/crm/Customers'
import CRMFollowUps from './pages/crm/FollowUps'
import CRMDeals from './pages/crm/Deals'
import CRMQuotations from './pages/crm/Quotations'
import SourcingRequests from './pages/SourcingRequests'
import Employees from './pages/Employees'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/containers" element={<AdminContainers />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/customers" element={<AdminCustomers />} />
                <Route path="/issues" element={<AdminIssues />} />
                <Route path="/jobs" element={<AdminJobs />} />
                <Route path="/tracking" element={<AdminTracking />} />
                <Route path="/contact-submissions" element={<AdminContactSubmissions />} />
                <Route path="/quotations" element={<AdminQuotations />} />
                <Route path="/reviews" element={<AdminReviews />} />
                {/* CRM Routes */}
                <Route path="/crm" element={<CRMDashboard />} />
                <Route path="/crm/leads" element={<CRMLeads />} />
                <Route path="/crm/customers" element={<CRMCustomers />} />
                <Route path="/crm/followups" element={<CRMFollowUps />} />
                <Route path="/crm/deals" element={<CRMDeals />} />
                <Route path="/crm/quotations" element={<CRMQuotations />} />
                <Route path="/sourcing-requests" element={<SourcingRequests />} />
                <Route path="/employees" element={<Employees />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
