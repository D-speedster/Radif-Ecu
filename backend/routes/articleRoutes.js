const express = require('express');
const router = express.Router();
const { getArticles, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public — downloadUrl stripped for private articles when unauthenticated
router.get('/', getArticles);

// Admin only
router.post('/',    protect, admin, createArticle);
router.patch('/:id', protect, admin, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

module.exports = router;
