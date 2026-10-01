import React, { useState } from 'react'

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

const OrderTracking = ({ container }) => {
  const [expanded, setExpanded] = useState(false)

  const currentStatusIndex = STATUS_STEPS.indexOf(container.currentStatus)

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {container.goods.map((item, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-semibold text-gray-800">
                  Order #{item.orderId?.orderNumber || 'N/A'}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {item.orderId?.status || 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{item.productId?.productName || 'Unknown Product'}</span>
                <span className="text-gray-400">•</span>
                <span>Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Current Status Badge */}
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

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-6 space-y-6">
          {/* Status Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Status</h3>
            <div className="space-y-2">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index < currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isPending = index > currentStatusIndex

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      isCompleted ? 'text-green-600' :
                      isCurrent ? 'text-orange-600 font-medium' :
                      'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipment Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Shipment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Container</p>
                <p className="text-sm font-medium text-gray-800">{container.containerNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Shipping Type</p>
                <p className="text-sm font-medium text-gray-800">{container.shippingType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Origin</p>
                <p className="text-sm font-medium text-gray-800">{container.origin}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Destination</p>
                <p className="text-sm font-medium text-gray-800">{container.destination}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ETD</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(container.etd)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ETA</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(container.eta)}</p>
              </div>
              {container.vesselName && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vessel Name</p>
                  <p className="text-sm font-medium text-gray-800">{container.vesselName}</p>
                </div>
              )}
              {container.voyageNumber && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Voyage Number</p>
                  <p className="text-sm font-medium text-gray-800">{container.voyageNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          {container.statusHistory && container.statusHistory.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Status History</h3>
              <div className="space-y-3">
                {container.statusHistory.slice().reverse().map((history, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{history.status}</p>
                      {history.notes && (
                        <p className="text-gray-600 text-xs mt-1">{history.notes}</p>
                      )}
                      {history.location && (
                        <p className="text-gray-500 text-xs mt-1">📍 {history.location}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(history.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderTracking
