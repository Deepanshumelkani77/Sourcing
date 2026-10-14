import React from 'react'

const QuickActions = ({ onAction }) => {
  const actions = [
    'Source a Product',
    'Request a Quote',
    'Our Services',
    'Talk to an Expert'
  ]

  return (
    <div className="chatbot-quick-actions-wrapper">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action)}
          className="chatbot-quick-action-card"
        >
          {action}
        </button>
      ))}
    </div>
  )
}

export default QuickActions
