const { generateChatResponse } = require('../services/openaiService');
const Product = require('../models/Product');
const Lead = require('../models/Lead');

// Store conversation history in memory (in production, use Redis or database)
const conversations = new Map();

const getProductSuggestions = async (query) => {
  try {
    const searchRegex = new RegExp(query.split(' ').join('|'), 'i');
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    }).limit(5);

    return products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      category: p.category,
      imageUrl: p.images?.[0] || null
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

const extractLeadInfo = (messages) => {
  const lastMessages = messages.slice(-5);
  const text = lastMessages.map(m => m.content).join(' ');
  
  const leadInfo = {
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    productRequirement: '',
    quantity: '',
    source: 'Chatbot',
    status: 'New',
    priority: 'Medium'
  };

  // Simple extraction patterns (can be enhanced with AI)
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) leadInfo.email = emailMatch[0];

  const phoneMatch = text.match(/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
  if (phoneMatch) leadInfo.phone = phoneMatch[0];

  // Extract name (simple pattern)
  const nameMatch = text.match(/(?:my name is|i am|i'm)\s+([a-zA-Z\s]+)/i);
  if (nameMatch) leadInfo.customerName = nameMatch[1].trim();

  // Extract company
  const companyMatch = text.match(/(?:from|at|company|work for)\s+([a-zA-Z0-9\s]+)/i);
  if (companyMatch) leadInfo.companyName = companyMatch[1].trim();

  return leadInfo;
};

const handleChat = async (req, res) => {
  try {
    const { message, conversationId, quickAction } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get or create conversation
    let conversation = conversations.get(conversationId) || [];
    
    // Add user message
    conversation.push({
      role: 'user',
      content: message
    });

    // Check if user wants to search for products
    const needsProductSearch = message.toLowerCase().includes('product') ||
                                message.toLowerCase().includes('source') ||
                                message.toLowerCase().includes('looking for') ||
                                message.toLowerCase().includes('need');

    let context = {};
    if (needsProductSearch) {
      const products = await getProductSuggestions(message);
      context.products = products;
    }

    // Generate AI response
    const aiResponse = await generateChatResponse(conversation, context);

    // Add bot response to conversation
    conversation.push({
      role: 'assistant',
      content: aiResponse
    });

    // Check if we should create a lead
    const shouldCreateLead = aiResponse.toLowerCase().includes('enquiry') ||
                              aiResponse.toLowerCase().includes('quotation') ||
                              conversation.length > 6;

    let leadCreated = false;
    if (shouldCreateLead && conversation.length > 4) {
      const leadInfo = extractLeadInfo(conversation);
      
      // Only create lead if we have basic info
      if (leadInfo.email || leadInfo.phone) {
        try {
          leadInfo.productRequirement = conversation
            .filter(m => m.role === 'user')
            .map(m => m.content)
            .join('; ');
          
          await Lead.create(leadInfo);
          leadCreated = true;
        } catch (error) {
          console.error('Error creating lead:', error);
        }
      }
    }

    // Determine quick actions based on context
    let quickActions = [];
    if (quickAction) {
      // After quick action, provide follow-up actions
      if (message === 'Source a Product') {
        quickActions = ['Request a Quote', 'Talk to an Expert'];
      } else if (message === 'Request a Quote') {
        quickActions = ['Source a Product', 'Talk to an Expert'];
      } else if (message === 'Our Services') {
        quickActions = ['Source a Product', 'Request a Quote'];
      } else if (message === 'Talk to an Expert') {
        quickActions = ['Source a Product', 'Request a Quote'];
      }
    } else {
      // Contextual quick actions
      if (needsProductSearch && context.products?.length > 0) {
        quickActions = ['Request a Quote', 'Talk to an Expert'];
      } else if (leadCreated) {
        quickActions = ['Request a Quote', 'Talk to an Expert'];
      }
    }

    // Save conversation
    const newConversationId = conversationId || Date.now().toString();
    conversations.set(newConversationId, conversation);

    // Limit conversation history to last 20 messages
    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
      conversations.set(newConversationId, conversation);
    }

    res.json({
      success: true,
      message: aiResponse,
      conversationId: newConversationId,
      quickActions,
      leadCreated
    });

  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await getProductSuggestions(q);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
};

module.exports = {
  handleChat,
  searchProducts
};
