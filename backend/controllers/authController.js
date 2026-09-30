const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Cookie options — set COOKIE_SECURE=true only when running behind HTTPS
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  secure: process.env.COOKIE_SECURE === 'true',
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Set token as httpOnly cookie — never exposed to JS
  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    user: {
      _id:        user._id,
      name:       user.name,
      identifier: user.identifier,
      phone:      user.phone || '',
      role:       user.role,
      createdAt:  user.createdAt,
    },
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, identifier, password } = req.body;

    if (!name || !identifier || !password) {
      return res.status(400).json({ success: false, message: 'لطفاً تمام فیلدهای اجباری را تکمیل کنید (نام، شناسه، رمز عبور)' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' });
    }

    const existingUser = await User.findOne({ identifier: identifier.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'این شماره موبایل یا ایمیل قبلاً ثبت شده است' });
    }

    const user = await User.create({
      name: name.trim(),
      identifier: identifier.trim().toLowerCase(),
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'این شماره موبایل یا ایمیل قبلاً ثبت شده است' });
    }
    console.error('Register Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'لطفاً شناسه و رمز عبور را وارد کنید' });
    }

    const user = await User.findOne({ identifier: identifier.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'اطلاعات ورود نادرست است' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'اطلاعات ورود نادرست است' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const logoutUser = (req, res) => {
  // Clear the token cookie by setting it with maxAge 0
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 0,
  });
  res.status(200).json({ success: true, message: 'خروج موفقیت‌آمیز بود' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id:        user._id,
        name:       user.name,
        identifier: user.identifier,
        phone:      user.phone || '',
        role:       user.role,
        createdAt:  user.createdAt,
      },
    });
  } catch (error) {
    console.error('GetMe Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
