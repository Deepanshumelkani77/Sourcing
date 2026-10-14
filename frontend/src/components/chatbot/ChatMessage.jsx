import React from 'react'

const ChatMessage = ({ message, onQuickAction }) => {
  if (message.type === 'user') {
    return (
      <div className="chatbot-message user">
        <div className="chatbot-bubble user">
          {message.content}
        </div>
      </div>
    )
  }

  // Bot message
  return (
    <div className="chatbot-message bot">
      <div className="chatbot-avatar-small">🤖</div>
      <div className="chatbot-bubble bot">
        {message.content}
        {message.quickActions && message.quickActions.length > 0 && (
          <div className="chatbot-quick-actions">
            {message.quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onQuickAction?.(action)}
                className="chatbot-quick-action-btn"
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
