import React, { useState, useEffect } from 'react'
import {
  getFieldConfigurations,
  createFieldConfiguration,
  updateFieldConfiguration,
  deleteFieldConfiguration,
  initializeDefaultFields
} from '../services/formFieldApi'

const FieldManager = ({ formType, onClose, onFieldsUpdated }) => {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [newField, setNewField] = useState({
    formType,
    fieldName: '',
    label: '',
    fieldType: 'text',
    placeholder: '',
    required: false,
    section: 'basic',
    order: 0,
    options: [],
    visible: true,
    description: ''
  })

  useEffect(() => {
    fetchFields()
  }, [formType])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const result = await getFieldConfigurations(formType)
      if (result.success) {
        setFields(result.fields || [])

        // Auto-initialize if no fields exist
        if (!result.fields || result.fields.length === 0) {
          console.log('No fields found, initializing defaults...')
          const initResult = await initializeDefaultFields(formType)
          if (initResult.success) {
            const fetchAgain = await getFieldConfigurations(formType)
            if (fetchAgain.success) {
              setFields(fetchAgain.fields || [])
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching fields:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInitializeDefaults = async () => {
    if (!window.confirm('This will reset all fields to default. Continue?')) return

    try {
      const result = await initializeDefaultFields(formType)
      if (result.success) {
        alert('Default fields initialized successfully')
        fetchFields()
      } else {
        alert(result.message || 'Failed to initialize default fields')
      }
    } catch (error) {
      alert('Failed to initialize default fields')
    }
  }

  const handleCreateField = async () => {
    try {
      const result = await createFieldConfiguration(newField)
      if (result.success) {
        setShowAddModal(false)
        setNewField({
          formType,
          fieldName: '',
          label: '',
          fieldType: 'text',
          placeholder: '',
          required: false,
          section: 'basic',
          order: 0,
          options: [],
          visible: true,
          description: ''
        })
        fetchFields()
        onFieldsUpdated?.()
      } else {
        alert(result.message || 'Failed to create field')
      }
    } catch (error) {
      alert('Failed to create field')
    }
  }

  const handleUpdateField = async () => {
    try {
      const result = await updateFieldConfiguration(editingField._id, editingField)
      if (result.success) {
        setEditingField(null)
        fetchFields()
        onFieldsUpdated?.()
      } else {
        alert(result.message || 'Failed to update field')
      }
    } catch (error) {
      alert('Failed to update field')
    }
  }

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return

    try {
      const result = await deleteFieldConfiguration(fieldId)
      if (result.success) {
        fetchFields()
        onFieldsUpdated?.()
      } else {
        alert(result.message || 'Failed to delete field')
      }
    } catch (error) {
      alert('Failed to delete field')
    }
  }

  const handleToggleVisibility = async (field) => {
    try {
      const result = await updateFieldConfiguration(field._id, { visible: !field.visible })
      if (result.success) {
        fetchFields()
        onFieldsUpdated?.()
      }
    } catch (error) {
      alert('Failed to update field')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600">Loading fields...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Form Field Manager</h2>
            <p className="text-sm text-gray-500 mt-1">Manage fields for {formType} form</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleInitializeDefaults}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition font-medium"
            >
              + Add Field
            </button>
            <button
              onClick={() => {
                onFieldsUpdated?.()
                onClose()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No fields configured. Click "Add Field" to add your first field.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(
                fields.reduce((acc, field) => {
                  if (!acc[field.section]) acc[field.section] = []
                  acc[field.section].push(field)
                  return acc
                }, {})
              ).map(([section, sectionFields]) => (
                <div key={section} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {sectionFields.map((field) => (
                      <div key={field._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              field.fieldType === 'text' ? 'bg-blue-100 text-blue-700' :
                              field.fieldType === 'email' ? 'bg-green-100 text-green-700' :
                              field.fieldType === 'number' ? 'bg-purple-100 text-purple-700' :
                              field.fieldType === 'select' ? 'bg-orange-100 text-orange-700' :
                              field.fieldType === 'textarea' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {field.fieldType}
                            </span>
                            <span className="font-medium text-gray-800">{field.label}</span>
                            {field.required && <span className="text-red-500">*</span>}
                            {!field.visible && <span className="text-gray-400">(hidden)</span>}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Field: {field.fieldName} • Order: {field.order}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVisibility(field)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              field.visible
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {field.visible ? 'Visible' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => setEditingField(field)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteField(field._id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Add New Field</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                <input
                  type="text"
                  value={newField.fieldName}
                  onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="e.g., firstName, shipperInfo.name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <input
                  type="text"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="e.g., First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
                <select
                  value={newField.fieldType}
                  onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="textarea">Textarea</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input
                  type="text"
                  value={newField.section}
                  onChange={(e) => setNewField({ ...newField, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  placeholder="e.g., basic, shipperInfo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="required"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
                />
                <label htmlFor="required" className="text-sm text-gray-700">Required</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateField}
                className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition font-medium"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Edit Field</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={editingField.placeholder}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingField.description}
                  onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editRequired"
                  checked={editingField.required}
                  onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                  className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
                />
                <label htmlFor="editRequired" className="text-sm text-gray-700">Required</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editVisible"
                  checked={editingField.visible}
                  onChange={(e) => setEditingField({ ...editingField, visible: e.target.checked })}
                  className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
                />
                <label htmlFor="editVisible" className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateField}
                className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition font-medium"
              >
                Update Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FieldManager
