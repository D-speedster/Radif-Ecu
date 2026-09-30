const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Read token from httpOnly cookie instead of Authorization header
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'دسترسی مجاز نیست. توکن یافت نشد.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'کاربر متعلق به این توکن دیگر وجود ندارد.' });
    }

    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'توکن منقضی شده است. لطفاً دوباره وارد شوید.'
        : 'توکن نامعتبر است.';

    return res.status(401).json({ success: false, message });
  }
};

// Must be chained after protect
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'دسترسی ممنوع. این بخش فقط برای مدیران سیستم در دسترس است.' });
};

module.exports = { protect, admin };
