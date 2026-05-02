const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, requireGlobalAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and System Admin role
router.use(authenticate, requireGlobalAdmin);

// Admin Requests
router.get('/pending', adminController.getPendingRequests);
router.post('/approve/:id', adminController.approveAdmin);
router.post('/reject/:id', adminController.rejectAdmin);

// User Management
router.get('/users', adminController.getAllUsers);

module.exports = router;
