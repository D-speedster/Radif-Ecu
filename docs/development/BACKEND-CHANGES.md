# تغییرات مورد نیاز در Backend

> این فایل تغییراتی را مستند می‌کند که برای پشتیبانی از slug در مقالات اعمال شده‌اند.

## ۱. فیلد slug در مدل Article

فایل: `backend/models/Article.js`

```javascript
slug: { 
  type: String, 
  unique: true,
  required: true,
  lowercase: true,
  trim: true
}
```

Auto-generate slug از عنوان فارسی با `pre('save')` hook اعمال شده.

---

## ۲. Endpoint دریافت مقاله با slug

فایل: `backend/routes/articleRoutes.js`

```javascript
// دریافت مقاله با slug (برای SEO)
router.get('/articles/:slug', async (req, res) => {
  const article = await Article.findOne({ 
    slug: req.params.slug,
    isPublished: true 
  });
  // ...
});
```

---

## ۳. Migration مقالات موجود

اگر مقالات بدون slug وجود دارند:

```bash
node scripts/add-slugs-to-existing-articles.js
```

---

## ۴. تست

```bash
# دریافت همه مقالات
GET http://localhost:5000/api/articles

# دریافت مقاله با slug
GET http://localhost:5000/api/articles/amozesh-ecu-bdm100
```
