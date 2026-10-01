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
import Login from './pages/Login'

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
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
