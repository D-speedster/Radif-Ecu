const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  updateMessageStatus,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');
const { publicFormLimiter, honeypot } = require('../middleware/antiSpam');

// Public
router.post('/', publicFormLimiter, honeypot, createContactMessage);

// Admin only
router.get('/', protect, admin, getContactMessages);
router.patch('/:id/status', protect, admin, updateMessageStatus);

module.exports = router;
