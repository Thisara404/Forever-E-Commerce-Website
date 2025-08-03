const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAnalytics
} = require('../controller/adminController');
const { adminAuth } = require('../middleware/Auth');

const router = express.Router();

// Debug middleware for dashboard stats
router.get('/dashboard/stats', (req, res, next) => {
  console.log('🛠️ [DEBUG] Incoming request to /api/admin/dashboard/stats');
  next();
}, adminAuth, async (req, res, next) => {
  console.log('🛠️ [DEBUG] Passed adminAuth, user:', req.user);
  next();
}, getDashboardStats);

// User management routes
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:userId/status', adminAuth, updateUserStatus);

// Analytics routes
router.get('/analytics', adminAuth, getAnalytics);

module.exports = router;