import React, { useEffect, useState } from 'react'
import { getAllOrders, createOrder, updateOrderStatus, deleteOrder } from '../services/orderApi'
import { getAllUsers } from '../services/userApi'
import { getAllProducts } from '../services/productApi'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [selectedProductIndex, setSelectedProductIndex] = useState(null)
  const [newOrder, setNewOrder] = useState({
    userId: '',
    items: [{ productId: '', quantity: 1, price: 0, productName: '' }],
    shippingAddress: '',
    billingAddress: '',
    notes: ''
  })
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (showCreateModal) {
      fetchUsers()
      fetchProducts()
    }
  }, [showCreateModal])

  useEffect(() => {
    if (productSearch && showProductDropdown) {
      fetchProducts()
    }
  }, [productSearch])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const result = await getAllProducts({ search: productSearch })
      if (result.success) {
        setProducts(result.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleProductSelect = (product, index) => {
    const items = [...newOrder.items]
    items[index].productId = product._id
    items[index].productName = product.productName
    items[index].price = product.price || 0
    setNewOrder({ ...newOrder, items })
    setShowProductDropdown(false)
    setProductSearch('')
    setSelectedProductIndex(null)
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const result = await getAllOrders({ search: searchTerm, status: statusFilter })
      if (result.success) {
        setOrders(result.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    // Validation
    if (!newOrder.userId) {
      alert('Please select a user')
      return
    }

    if (!newOrder.items || newOrder.items.length === 0) {
      alert('Please add at least one item')
      return
    }

    for (const item of newOrder.items) {
      if (!item.productId) {
        alert('Please select a product for all items')
        return
      }
      if (!item.quantity || item.quantity < 1) {
        alert('Quantity must be at least 1')
        return
      }
      if (!item.price || item.price < 0) {
        alert('Price must be a positive number')
        return
      }
    }

    try {
      const result = await createOrder(newOrder)
      if (result.success) {
        setShowCreateModal(false)
        setNewOrder({
          userId: '',
          items: [{ productId: '', quantity: 1, price: 0, productName: '' }],
          shippingAddress: '',
          billingAddress: '',
          notes: ''
        })
        fetchOrders()
      } else {
        alert(result.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order')
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const result = await updateOrderStatus(selectedOrder._id, newStatus)
      if (result.success) {
        setShowStatusModal(false)
        setSelectedOrder(null)
        setNewStatus('')
        fetchOrders()
      } else {
        alert(result.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return

    try {
      const result = await deleteOrder(orderId)
      if (result.success) {
        fetchOrders()
      } else {
        alert(result.message || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
    }
  }

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: '', quantity: 1, price: 0, productName: '' }]
    })
  }

  const removeItem = (index) => {
    const items = newOrder.items.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, items })
  }

  const updateItem = (index, field, value) => {
    const items = [...newOrder.items]
    items[index][field] = value
    setNewOrder({ ...newOrder, items })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#F41703] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D41503] transition"
        >
          Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Under Manufacturing">Under Manufacturing</option>
            <option value="Under Inspection">Under Inspection</option>
            <option value="Under Packing">Under Packing</option>
            <option value="Transportation to Shipping Port/Airport">Transportation to Shipping Port/Airport</option>
            <option value="Under Delivery">Under Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{order.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-xs">{item.productName}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.totalQuantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Under Delivery'
                          ? 'bg-teal-100 text-teal-700'
                          : order.status === 'Transportation to Shipping Port/Airport'
                          ? 'bg-purple-100 text-purple-700'
                          : order.status === 'Under Packing'
                          ? 'bg-orange-100 text-orange-700'
                          : order.status === 'Under Inspection'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'Under Manufacturing'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'Order Placed'
                          ? 'bg-gray-100 text-gray-700'
                          : order.status === 'Pending'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowStatusModal(true)
                              setNewStatus(order.status)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Update Status
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
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

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Create New Order</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">Loading users...</div>
                ) : (
                  <select
                    value={newOrder.userId}
                    onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                    <div className="relative mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Search Product</label>
                      <input
                        type="text"
                        value={selectedProductIndex === index && item.productName ? item.productName : productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value)
                          setShowProductDropdown(true)
                          setSelectedProductIndex(index)
                        }}
                        onFocus={() => {
                          setShowProductDropdown(true)
                          setSelectedProductIndex(index)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                        placeholder="Search products by name..."
                      />
                      {showProductDropdown && selectedProductIndex === index && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {loadingProducts ? (
                            <div className="p-3 text-sm text-gray-500">Loading products...</div>
                          ) : products.length === 0 ? (
                            <div className="p-3 text-sm text-gray-500">No products found</div>
                          ) : (
                            products.map((product) => (
                              <div
                                key={product._id}
                                onClick={() => handleProductSelect(product, index)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                              >
                                <div className="font-medium text-gray-800">{product.productName}</div>
                                <div className="text-xs text-gray-500">
                                  {product.category} • ${product.price?.toFixed(2) || 'N/A'}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            updateItem(index, 'price', value >= 0 ? value : 0)
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                        />
                      </div>
                      {newOrder.items.length > 1 && (
                        <div className="flex items-end">
                          <button
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#F41703] hover:text-[#F41703] transition font-medium"
                >
                  + Add Another Item
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                <textarea
                  value={newOrder.shippingAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="Enter shipping address"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                <textarea
                  value={newOrder.billingAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, billingAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="Enter billing address"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="Enter notes"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#D41503] transition"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
                <button
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedOrder(null)
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
                Order: <span className="font-medium">{selectedOrder.orderNumber}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Under Manufacturing">Under Manufacturing</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Under Packing">Under Packing</option>
                <option value="Transportation to Shipping Port/Airport">Transportation to Shipping Port/Airport</option>
                <option value="Under Delivery">Under Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              {newStatus === 'Transportation to Shipping Port/Airport' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    Order is ready for container management.
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = '/admin/containers'
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Go to Container Page
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#D41503] transition"
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

export default AdminOrders
