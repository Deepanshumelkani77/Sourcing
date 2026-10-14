# Chatbot Setup Guide

This guide will help you set up the IndoChinaBridge AI Chatbot for your website.

## Prerequisites

1. OpenAI API Key - Get one from https://platform.openai.com/api-keys
2. Backend server running on port 5000
3. Frontend server running on port 5173

## Installation Steps

### 1. Install OpenAI SDK in Backend

Navigate to the backend directory and install the OpenAI package:

```bash
cd backend
npm install openai
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory (if it doesn't exist) and add your OpenAI API key:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Make sure you also have these existing variables configured:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- Other existing environment variables

### 3. Restart Backend Server

Stop the backend server (if running) and restart it:

```bash
cd backend
npm run dev
```

### 4. Restart Frontend Server

Stop the frontend server (if running) and restart it:

```bash
cd frontend
npm run dev
```

## Features Implemented

### Frontend Components
- **Chatbot.jsx** - Main chatbot component with floating button and chat window
- **ChatMessage.jsx** - Individual message component for user and bot messages
- **QuickActions.jsx** - Quick action buttons for common tasks
- **Chatbot.css** - Styling for the chatbot with responsive design

### Backend Components
- **openaiService.js** - OpenAI integration service with system prompt
- **chatController.js** - Chat API controller with lead generation
- **chat.js** - API routes for chat endpoints

### Key Features

1. **AI-Powered Conversations**
   - Uses GPT-4o-mini for intelligent responses
   - Context-aware conversations
   - Professional IndoChinaBridge persona

2. **Product Search Integration**
   - Searches your MongoDB product database
   - Returns relevant product suggestions
   - Helps users find what they need

3. **CRM Lead Generation**
   - Automatically extracts lead information from conversations
   - Creates leads in your CRM when appropriate
   - Marks source as "Chatbot"
   - Captures: name, company, email, phone, product requirements

4. **Quick Actions**
   - Source a Product
   - Request a Quote
   - Our Services
   - Talk to an Expert

5. **Responsive Design**
   - Works on desktop and mobile
   - Floating chat button
   - Smooth animations

## Configuration

### Production API URL

The chatbot is currently configured to use your production Render API:
```
https://sourcing-x379.onrender.com/api
```

This is the default setting in `frontend/src/components/chatbot/Chatbot.jsx`.

### Changing the API URL

You can configure the API URL using environment variables or by editing the code directly:

**Option 1: Using Environment Variable (Recommended)**

Create a `.env` file in the frontend directory:

```bash
# For production
VITE_CHATBOT_API_URL=https://sourcing-x379.onrender.com/api

# For local development with Vite proxy
VITE_CHATBOT_API_URL=/api

# For local backend
VITE_CHATBOT_API_URL=http://localhost:5000/api
```

**Option 2: Edit the Code**

Edit `frontend/src/components/chatbot/Chatbot.jsx`:

```javascript
const API_BASE_URL = 'https://sourcing-x379.onrender.com/api'  // Production
// const API_BASE_URL = '/api'  // Local with Vite proxy
// const API_BASE_URL = 'http://localhost:5000/api'  // Local backend
```

## How It Works

### User Flow

1. User clicks floating chat button
2. Chatbot opens with greeting
3. User can:
   - Type a message
   - Click quick action buttons
4. AI responds intelligently
5. If user wants to source products:
   - Bot searches product database
   - Shows relevant products
   - Collects lead information
   - Creates CRM lead automatically
6. User can request to talk to expert at any time

### Lead Generation

The chatbot automatically creates leads when:
- User provides contact information (email or phone)
- Conversation indicates interest in sourcing
- User requests a quotation

Leads are created with:
- Source: "Chatbot"
- Status: "New"
- Priority: "Medium"
- Product requirements from conversation

## Customization

### Modify Chatbot Persona

Edit `backend/services/openaiService.js` to change the system prompt:

```javascript
const SYSTEM_PROMPT = `You are the IndoChinaBridge AI Sourcing Assistant...
// Customize the persona, rules, and company information here
```

### Change Quick Actions

Edit `frontend/src/components/chatbot/QuickActions.jsx`:

```javascript
const actions = [
  'Source a Product',
  'Request a Quote',
  'Our Services',
  'Talk to an Expert'
]
// Add or remove actions as needed
```

### Modify Styling

Edit `frontend/src/components/chatbot/Chatbot.css` to customize:
- Colors (currently using #F41703 gradient)
- Sizes
- Animations
- Responsive breakpoints

## Testing

1. Start both servers (backend on 5000, frontend on 5173)
2. Open http://localhost:5173 in your browser
3. Click the floating chat button in bottom-right corner
4. Try:
   - "I need to source conference cameras"
   - "What services do you offer?"
   - "I want a quotation"
   - Click quick action buttons

## Troubleshooting

### Chatbot Not Responding

- Check backend server is running on port 5000
- Verify OPENAI_API_KEY is set in .env
- Check browser console for errors
- Verify API proxy is configured in vite.config.js

### Lead Not Created

- Check MongoDB connection
- Verify Lead model has "Chatbot" in source enum
- Check backend logs for errors
- Ensure user provided email or phone

### Product Search Not Working

- Verify Product model exists in backend
- Check product data in MongoDB
- Review search regex in chatController.js

## Production Deployment

1. Set `OPENAI_API_KEY` in production environment variables
2. Consider using Redis for conversation storage (currently using in-memory Map)
3. Add rate limiting to prevent API abuse
4. Monitor OpenAI API usage and costs
5. Add analytics to track chatbot usage

## Cost Considerations

- OpenAI GPT-4o-mini: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- Typical conversation: ~100-200 tokens per message
- Estimate: ~$0.01-0.02 per conversation
- Monitor usage in OpenAI dashboard

## Future Enhancements

- Add conversation history to database
- Implement multi-language support
- Add file/image upload capability
- Integrate with WhatsApp Business API
- Add voice input/output
- Implement conversation analytics
- Add chatbot training on your product data
- Integration with CRM follow-up automation

## Support

If you encounter issues:
1. Check browser console for frontend errors
2. Check backend terminal for server errors
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Check OpenAI API key is valid

## Files Created/Modified

### Frontend
- `frontend/src/components/chatbot/Chatbot.jsx` (new - configured for production API)
- `frontend/src/components/chatbot/ChatMessage.jsx` (new)
- `frontend/src/components/chatbot/QuickActions.jsx` (new)
- `frontend/src/components/chatbot/Chatbot.css` (new)
- `frontend/src/App.jsx` (modified - added Chatbot import)
- `frontend/vite.config.js` (modified - added API proxy for local development)

### Backend
- `backend/services/openaiService.js` (new)
- `backend/controllers/chatController.js` (new)
- `backend/routes/chat.js` (new)
- `backend/server.js` (modified - added chat routes)
- `backend/models/Lead.js` (modified - added "Chatbot" to source enum)
- `backend/.env.example` (new - added OPENAI_API_KEY)
