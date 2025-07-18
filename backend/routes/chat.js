const express = require('express');
const { getChat, sendMessage, getConversations, markAsRead } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/:matchId', auth, getChat);
router.post('/:matchId', auth, sendMessage);
router.post('/:matchId/read', auth, markAsRead);

module.exports = router; 