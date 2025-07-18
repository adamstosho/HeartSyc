const express = require('express');
const { getSuggestions, sendRequest, acceptRequest, rejectRequest, getReceivedRequests, getSentRequests, getMatchedRequests } = require('../controllers/matchController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/suggestions', auth, getSuggestions);
router.post('/request/:userId', auth, sendRequest);
router.post('/accept/:requestId', auth, acceptRequest);
router.post('/reject/:requestId', auth, rejectRequest);
router.get('/received', auth, getReceivedRequests);
router.get('/sent', auth, getSentRequests);
router.get('/matched', auth, getMatchedRequests);

module.exports = router; 