# Render Environment Setup for Chatbot

## ⚠️ Important: Add OPENAI_API_KEY to Render

Your backend is failing to start because the `OPENAI_API_KEY` environment variable is not set in Render.

## Steps to Fix

### 1. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

### 2. Add Environment Variable in Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service: `sourcing-x379`
3. Navigate to the "Environment" tab
4. Click "Add Environment Variable"
5. Fill in:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `sk-your-actual-api-key-here` (paste your key)
6. Click "Save Changes"

### 3. Trigger New Deployment

After adding the environment variable:
1. Go to the "Manual Deploy" section in Render
2. Click "Deploy latest commit"
3. Wait for the deployment to complete

### 4. Verify

Check the deployment logs to ensure:
- No "OPENAI_API_KEY environment variable is missing" error
- Server starts successfully
- Chatbot is functional

## What Was Changed

The code has been updated to handle missing API keys gracefully:
- The server will now start even without the API key
- Chatbot will show a friendly message if API key is missing
- Other backend features will continue to work normally

However, for the chatbot to function properly, you MUST add the `OPENAI_API_KEY` environment variable in Render.

## Alternative: Disable Chatbot Temporarily

If you want to deploy without the chatbot for now:

Option 1: Comment out chat routes in `server.js`:
```javascript
// app.use("/api", chatRoutes);  // Comment this line
```

Option 2: Remove chatbot from frontend:
- Remove `<Chatbot />` from `frontend/src/App.jsx`

## Testing After Setup

Once the API key is added and deployed:

1. Open your website: https://sourcing-x379.onrender.com
2. Click the floating chat button (bottom-right)
3. Try: "Hi, I need help sourcing products"
4. The bot should respond intelligently

## Cost Information

OpenAI GPT-4o-mini pricing:
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens
- Typical conversation: ~100-200 tokens per message
- Estimated cost: ~$0.01-0.02 per conversation

Monitor usage at: https://platform.openai.com/usage

## Support

If you encounter issues:
1. Verify the API key is correctly set in Render environment variables
2. Check Render deployment logs
3. Ensure the API key is valid and active
4. Check your OpenAI account has credits/billing set up
