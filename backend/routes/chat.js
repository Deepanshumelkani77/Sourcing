const express = require('express');
const router = express.Router();
const { handleChat, searchProducts } = require('../controllers/chatController');

// Chat endpoint
router.post('/chat', handleChat);

// Product search endpoint for chatbot
router.get('/chat/products', searchProducts);

module.exports = router;
