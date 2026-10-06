const express = require('express');
const router = express.Router();
const { 
  getLandingPages,
  getPublishedLandingPagesList,
  getLandingPageBySlug, 
  getLandingPageById,
  createLandingPage, 
  updateLandingPage, 
  deleteLandingPage 
} = require('../controllers/landingPageController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all landing pages — admin only
router.get('/', protect, admin, getLandingPages);

// GET published landing pages list for sitemap — public (must be before /:slug)
router.get('/published/list', getPublishedLandingPagesList);

// GET one by ID — admin only
router.get('/by-id/:id', protect, admin, getLandingPageById);

// GET one by slug — public (but only published unless admin)
router.get('/:slug', getLandingPageBySlug);

// POST create new — admin only
router.post('/', protect, admin, createLandingPage);

// PUT update by :id — admin only
router.put('/:id', protect, admin, updateLandingPage);

// DELETE by :id — admin only
router.delete('/:id', protect, admin, deleteLandingPage);

module.exports = router;
