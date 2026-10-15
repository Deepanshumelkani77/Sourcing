import React from 'react'

const QuickActions = ({ onAction }) => {
  const actions = [
    'Source a Product',
    'Request a Quote',
    'Our Services',
    'Talk to an Expert'
  ]

  const styles = {
    wrapper: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      padding: '0 20px 20px',
    },
    card: {
      padding: '12px 16px',
      background: 'white',
      border: '2px solid #F41703',
      borderRadius: '8px',
      color: '#F41703',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  }

  return (
    <div className="chatbot-quick-actions-wrapper" style={styles.wrapper}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(action)}
          className="chatbot-quick-action-card"
          style={styles.card}
          onMouseEnter={(e) => {
            e.target.style.background = '#F41703'
            e.target.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white'
            e.target.style.color = '#F41703'
          }}
        >
          {action}
        </button>
      ))}
    </div>
  )
}

export default QuickActions
