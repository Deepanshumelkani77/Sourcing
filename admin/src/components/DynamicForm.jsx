import React from 'react'

const DynamicForm = ({ fields, data, onChange, disabled = false }) => {
  const renderField = (field) => {
    const fieldPath = field.fieldName
    const fieldValue = getNestedValue(data, fieldPath)

    const handleChange = (value) => {
      onChange(fieldPath, value)
    }

    const commonProps = {
      disabled,
      placeholder: field.placeholder || '',
      className: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`
    }

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type={field.fieldType}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            {...commonProps}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            rows={3}
            {...commonProps}
          />
        )

      case 'select':
        return (
          <select
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            {...commonProps}
          >
            <option value="">Select...</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={field.fieldName}
              checked={fieldValue || false}
              onChange={(e) => handleChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
            />
            <label htmlFor={field.fieldName} className="text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        )

      default:
        return null
    }
  }

  // Helper to get nested object values (e.g., 'shipperInfo.name')
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = []
    }
    acc[field.section].push(field)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedFields).map(([section, sectionFields]) => (
        <div key={section} className="border-t pt-4">
          {section !== 'basic' && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
              {section.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectionFields.map((field) => (
              <div key={field._id} className={field.fieldType === 'textarea' ? 'md:col-span-3' : ''}>
                {field.fieldType !== 'checkbox' && (
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DynamicForm
