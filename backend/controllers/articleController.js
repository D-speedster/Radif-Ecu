const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const User = require('../models/User');
const { uniqueSlug } = require('../utils/slug');
const { cleanHtml, toPlainText } = require('../utils/sanitizeHtml');

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

// Strip downloadUrl from private articles for unauthenticated responses
const sanitiseForGuest = (article) => {
  const obj = article.toObject();
  if (obj.isPrivate) {
    obj.downloadUrl = null;
    obj.downloadLocked = true;
    // محتوای کامل مقالهٔ خصوصی برای مهمان ارسال نمی‌شود؛ فقط پیش‌نمایش کوتاه
    const preview = toPlainText(obj.content).slice(0, 300);
    obj.content = `<p>${preview}${preview.length >= 300 ? '…' : ''}</p>`;
    obj.contentLocked = true;
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

    res.status(200).json({ 
      success: true, 
      count: data.length, 
      authenticated: isAuthenticated, 
      articles: data 
    });
  } catch (error) {
    console.error('getArticles Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// همهٔ مقالات (با پیش‌نویس) — فقط ادمین
const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, articles });
  } catch (error) {
    console.error('getAllArticlesAdmin Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

// یک مقاله با slug یا _id
const getArticleByKey = async (req, res) => {
  try {
    const key = req.params.idOrSlug;
    const query = mongoose.isValidObjectId(key) ? { $or: [{ slug: key }, { _id: key }] } : { slug: key };
    const article = await Article.findOne(query);
    const isAdmin = await isRequestAdmin(req);

    if (!article || (!article.published && !isAdmin)) {
      return res.status(404).json({ success: false, message: 'مقاله مورد نظر یافت نشد' });
    }

    const authenticated = isRequestAuthenticated(req);
    res.status(200).json({
      success: true,
      authenticated,
      article: authenticated ? article.toObject() : sanitiseForGuest(article),
    });
  } catch (error) {
    console.error('getArticleByKey Error:', error.message);
    res.status(500).json({ success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, category, downloadUrl, isPrivate, published, excerpt, slug } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'عنوان و دسته‌بندی الزامی هستند' });
    }

    const valid = ['ecu', 'multiplex', 'dtc', 'dump'];
    if (!valid.includes(category)) {
      return res.status(400).json({ success: false, message: 'دسته‌بندی نامعتبر است. مقادیر مجاز: ecu، multiplex، dtc، dump' });
    }

    // Validation برای downloadUrl
    let validatedDownloadUrl = null;
    if (downloadUrl && downloadUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(downloadUrl.trim())) {
        return res.status(400).json({ success: false, message: 'فرمت لینک دانلود نامعتبر است' });
      }
      validatedDownloadUrl = downloadUrl.trim();
    }

    const cleanedContent = cleanHtml((content || '').trim());
    
    // Auto-generate excerpt اگر خالی باشد
    let finalExcerpt = (excerpt || '').trim();
    if (!finalExcerpt && cleanedContent) {
      const plainText = toPlainText(cleanedContent);
      finalExcerpt = plainText.substring(0, 300);
    }

    const article = await Article.create({
      title:       title.trim(),
      slug:        await uniqueSlug(Article, slug || title),
      excerpt:     finalExcerpt,
      content:     cleanedContent,
      category,
      downloadUrl: validatedDownloadUrl,
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
    const allowed = ['title', 'content', 'category', 'downloadUrl', 'isPrivate', 'published', 'excerpt'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (updates.content) updates.content = cleanHtml(updates.content);

    // Validation برای downloadUrl
    if (updates.downloadUrl !== undefined) {
      if (updates.downloadUrl && updates.downloadUrl.trim()) {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(updates.downloadUrl.trim())) {
          return res.status(400).json({ success: false, message: 'فرمت لینک دانلود نامعتبر است' });
        }
        updates.downloadUrl = updates.downloadUrl.trim();
      } else {
        updates.downloadUrl = null;
      }
    }

    if (req.body.slug) updates.slug = await uniqueSlug(Article, req.body.slug, req.params.id);

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

module.exports = { getArticles, getAllArticlesAdmin, getArticleByKey, createArticle, updateArticle, deleteArticle };
