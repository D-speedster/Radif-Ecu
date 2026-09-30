const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentByTracking,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.post('/', createAppointment);
// Must be declared before /:id to avoid Express treating "track" as an ObjectId
router.get('/track/:code', getAppointmentByTracking);

// Admin only
router.get('/', protect, admin, getAppointments);
router.patch('/:id/status', protect, admin, updateAppointmentStatus);

module.exports = router;
