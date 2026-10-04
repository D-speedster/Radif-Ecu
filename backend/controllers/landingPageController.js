const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const LandingPage = require('../models/LandingPage');
const User = require('../models/User');
const { uniqueSlug } = require('../utils/slug');

// آیا درخواست از طرف ادمین است؟ (برای دیدن پیش‌نویس‌ها)
const isRequestAdmin = async (req) => {
  const token = req.cookies?.token;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return !!user && user.role === 'admin';
  } catch {
    return false;
  }
};

// GET all landing pages — admin only, returns all including unpublished
const getLandingPages = async (req, res) => {
  try {
    const landingPages = await LandingPage.find({}).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: landingPages.length, 
      landingPages 
    });
  } catch (error) {
    console.error('getLandingPages Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// GET one by slug — public, only published unless admin
const getLandingPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const landingPage = await LandingPage.findOne({ slug });
    const isAdmin = await isRequestAdmin(req);

    if (!landingPage || (!landingPage.published && !isAdmin)) {
      return res.status(404).json({ success: false, message: 'صفحه مورد نظر یافت نشد' });
    }

    res.status(200).json({
      success: true,
      landingPage: landingPage.toObject(),
    });
  } catch (error) {
    console.error('getLandingPageBySlug Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// POST create new — admin only
const createLandingPage = async (req, res) => {
  try {
    const { title, slug, category, sections, metadata, schema, published } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'عنوان الزامی است' });
    }

    const landingPage = await LandingPage.create({
      title: title.trim(),
      slug: await uniqueSlug(LandingPage, slug || title),
      category: category ? category.trim() : '',
      sections: sections || [],
      metadata: metadata || { metaTitle: '', metaDescription: '', keywords: [] },
      schema: schema || null,
      published: published !== undefined ? Boolean(published) : true,
    });

    res.status(201).json({ 
      success: true, 
      message: 'صفحه با موفقیت ایجاد شد', 
      landingPage 
    });
  } catch (error) {
    console.error('createLandingPage Error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'slug تکراری است. لطفاً یک slug منحصر به فرد انتخاب کنید.' });
    }
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// PUT update by :id — admin only
const updateLandingPage = async (req, res) => {
  try {
    const allowed = ['title', 'slug', 'category', 'sections', 'metadata', 'schema', 'published'];
    const updates = {};
    allowed.forEach((f) => { 
      if (req.body[f] !== undefined) updates[f] = req.body[f]; 
    });

    // اگر slug جدید ارسال شده، بررسی یکتایی
    if (req.body.slug) {
      updates.slug = await uniqueSlug(LandingPage, req.body.slug, req.params.id);
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'هیچ فیلدی برای به‌روزرسانی ارسال نشده است' });
    }

    const landingPage = await LandingPage.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'صفحه مورد نظر یافت نشد' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'صفحه با موفقیت به‌روزرسانی شد', 
      landingPage 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه صفحه نامعتبر است' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'slug تکراری است. لطفاً یک slug منحصر به فرد انتخاب کنید.' });
    }
    console.error('updateLandingPage Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// DELETE by :id — admin only
const deleteLandingPage = async (req, res) => {
  try {
    const landingPage = await LandingPage.findByIdAndDelete(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ success: false, message: 'صفحه مورد نظر یافت نشد' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'صفحه با موفقیت حذف شد', 
      deletedId: req.params.id 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه صفحه نامعتبر است' });
    }
    console.error('deleteLandingPage Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

module.exports = { 
  getLandingPages, 
  getLandingPageBySlug, 
  createLandingPage, 
  updateLandingPage, 
  deleteLandingPage 
};
