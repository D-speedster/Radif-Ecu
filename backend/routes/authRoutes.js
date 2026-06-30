const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Brute-force protection: max 5 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.',
  },
});

router.post('/register', authLimiter, registerUser);
router.post('/login',    authLimiter, loginUser);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

module.exports = router;
