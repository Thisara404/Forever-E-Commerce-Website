const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAnalytics
} = require('../controller/adminController');
const { adminAuth } = require('../middleware/Auth'); // Fix: Use correct case and path

const router = express.Router();

// Dashboard routes
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// User management routes
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:userId/status', adminAuth, updateUserStatus);

// Analytics routes
router.get('/analytics', adminAuth, getAnalytics);

module.exports = router;