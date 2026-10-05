const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/upload/article-image
// آپلود تصویر برای مقالات دانشنامه
// فقط Admin
router.post('/article-image', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'هیچ فایلی آپلود نشده است',
      });
    }

    // URL عمومی تصویر
    const imageUrl = `/uploads/articles/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'تصویر با موفقیت آپلود شد',
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'خطا در آپلود تصویر',
    });
  }
});

// Error handler برای خطاهای multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'حجم فایل بیش از حد مجاز است (حداکثر 5MB)',
      });
    }
    return res.status(400).json({
      success: false,
      message: `خطای آپلود: ${error.message}`,
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  next();
});

module.exports = router;
