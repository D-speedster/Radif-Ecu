/**
 * Admin Authorization Middleware
 * Ensures that the authenticated user has admin role
 * Must be used AFTER authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  // req.user is already attached by authMiddleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'احراز هویت انجام نشده است',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'دسترسی غیرمجاز. فقط ادمین‌ها می‌توانند به این بخش دسترسی داشته باشند.',
    });
  }

  next();
};

module.exports = adminMiddleware;
