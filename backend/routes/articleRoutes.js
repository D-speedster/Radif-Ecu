const express = require('express');
const router = express.Router();
const { getArticles, getAllArticlesAdmin, getArticleByKey, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public — downloadUrl stripped for private articles when unauthenticated
router.get('/', getArticles);

// باید قبل از /:idOrSlug باشد
router.get('/admin/all', protect, admin, getAllArticlesAdmin);
router.get('/:idOrSlug', getArticleByKey);

// Admin only
router.post('/',    protect, admin, createArticle);
router.patch('/:id', protect, admin, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

module.exports = router;
