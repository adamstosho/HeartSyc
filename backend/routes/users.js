const express = require('express');
const { getUser, updateUser, deleteUser, filterUsers, getDashboardStats } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, filterUsers);
router.get('/me/dashboard-stats', auth, getDashboardStats);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router; 