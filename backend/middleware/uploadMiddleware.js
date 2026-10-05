const multer = require('multer');
const path = require('path');
const fs = require('fs');

// مسیر ذخیره‌سازی عکس‌ها
const uploadDir = path.join(__dirname, '../../public/uploads/articles');

// ایجاد پوشه در صورت عدم وجود
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیمات ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // نام یونیک: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `article-${uniqueSuffix}${ext}`);
  },
});

// فیلتر فایل‌های مجاز (فقط تصاویر)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری (jpg, jpeg, png, gif, webp) مجاز هستند'));
  }
};

// ایجاد middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // حداکثر 5MB
  },
  fileFilter: fileFilter,
});

module.exports = { upload, uploadDir };
