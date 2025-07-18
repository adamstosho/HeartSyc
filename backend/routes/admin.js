const express = require('express');
const { getAllUsers, verifyUser, banUser, unbanUser, deleteUser, getReports, getAdminStats, reportUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/users', auth, admin, getAllUsers);
router.post('/verify-user/:id', auth, admin, verifyUser);
router.post('/ban-user/:id', auth, admin, banUser);
router.post('/unban-user/:id', auth, admin, unbanUser);
router.delete('/delete-user/:id', auth, admin, deleteUser);
router.get('/reports', auth, admin, getReports);
router.post('/report-user/:id', auth, reportUser);
router.get('/stats', auth, admin, getAdminStats);

module.exports = router; 