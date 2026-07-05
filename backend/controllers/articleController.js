const jwt = require('jsonwebtoken');
const Article = require('../models/Article');

// Silently check httpOnly cookie token — used on soft-auth routes
const isRequestAuthenticated = (req) => {
  const token = req.cookies?.token;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

// Strip downloadUrl from private articles for unauthenticated responses
const sanitiseForGuest = (article) => {
  const obj = article.toObject();
  if (obj.isPrivate) {
    obj.downloadUrl = null;
    obj.downloadLocked = true;
  }
  return obj;
};

const getArticles = async (req, res) => {
  try {
    const filter = { published: true };

    if (req.query.category) {
      const valid = ['ecu', 'multiplex', 'dtc', 'dump'];
      if (!valid.includes(req.query.category)) {
        return res.status(400).json({ success: false, message: 'دسته‌بندی نامعتبر است. مقادیر مجاز: ecu، multiplex، dtc، dump' });
      }
      filter.category = req.query.category;
    }

    if (req.query.q) filter.$text = { $search: req.query.q };

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    const isAuthenticated = isRequestAuthenticated(req);

    const data = isAuthenticated
      ? articles.map((a) => a.toObject())
      : articles.map((a) => sanitiseForGuest(a));

    res.status(200).json({ success: true, count: data.length, authenticated: isAuthenticated, articles: data });
  } catch (error) {
    console.error('getArticles Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, category, downloadUrl, isPrivate, published } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'عنوان و دسته‌بندی الزامی هستند' });
    }

    const valid = ['ecu', 'multiplex', 'dtc', 'dump'];
    if (!valid.includes(category)) {
      return res.status(400).json({ success: false, message: 'دسته‌بندی نامعتبر است. مقادیر مجاز: ecu، multiplex، dtc، dump' });
    }

    const article = await Article.create({
      title:       title.trim(),
      content:     (content || '').trim(),
      category,
      downloadUrl: downloadUrl ? downloadUrl.trim() : null,
      isPrivate:   isPrivate  !== undefined ? Boolean(isPrivate)  : true,
      published:   published  !== undefined ? Boolean(published)  : false,
    });

    res.status(201).json({ success: true, message: 'مقاله با موفقیت ایجاد شد', article });
  } catch (error) {
    console.error('createArticle Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const allowed = ['title', 'content', 'category', 'downloadUrl', 'isPrivate', 'published'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'هیچ فیلدی برای به‌روزرسانی ارسال نشده است' });
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد' });
    }

    res.status(200).json({ success: true, message: 'مقاله با موفقیت به‌روزرسانی شد', article });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه مقاله نامعتبر است' });
    }
    console.error('updateArticle Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد' });
    }
    res.status(200).json({ success: true, message: 'مقاله با موفقیت حذف شد', deletedId: req.params.id });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'شناسه مقاله نامعتبر است' });
    }
    console.error('deleteArticle Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

module.exports = { getArticles, createArticle, updateArticle, deleteArticle };
