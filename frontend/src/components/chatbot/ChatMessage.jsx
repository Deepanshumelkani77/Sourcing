import React from 'react'

const ChatMessage = ({ message, onQuickAction }) => {
  const styles = {
    message: {
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start',
    },
    messageUser: {
      justifyContent: 'flex-end',
    },
    avatarSmall: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #F41703 0%, #F97316 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
    },
    bubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '12px',
      lineHeight: 1.5,
      fontSize: '14px',
    },
    bubbleBot: {
      background: '#f3f4f6',
      color: '#1f2937',
      borderRadius: '12px 12px 12px 0',
    },
    bubbleUser: {
      background: 'linear-gradient(135deg, #F41703 0%, #F97316 100%)',
      color: 'white',
      borderRadius: '12px 12px 0 12px',
    },
    quickActions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '12px',
    },
    quickActionBtn: {
      padding: '8px 12px',
      background: 'white',
      border: '1px solid #F41703',
      borderRadius: '6px',
      color: '#F41703',
      fontSize: '12px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  }

  if (message.type === 'user') {
    return (
      <div className="chatbot-message user" style={{...styles.message, ...styles.messageUser}}>
        <div className="chatbot-bubble user" style={{...styles.bubble, ...styles.bubbleUser}}>
          {message.content}
        </div>
      </div>
    )
  }

  // Bot message
  return (
    <div className="chatbot-message bot" style={styles.message}>
      <div className="chatbot-avatar-small" style={styles.avatarSmall}>🤖</div>
      <div className="chatbot-bubble bot" style={{...styles.bubble, ...styles.bubbleBot}}>
        {message.content}
        {message.quickActions && message.quickActions.length > 0 && (
          <div className="chatbot-quick-actions" style={styles.quickActions}>
            {message.quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onQuickAction?.(action)}
                className="chatbot-quick-action-btn"
                style={styles.quickActionBtn}
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
        )}
      </div>
    </div>
  )
}

export default ChatMessage
