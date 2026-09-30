# ✅ چک‌لیست تست SEO

## 🎯 آماده‌سازی

```bash
# 1. Backend
cd backend && npm start

# 2. Frontend
npm run dev
```

سایت روی http://localhost:3000 اجرا می‌شود.

---

## 📋 تست‌های SEO

### ✅ تست ۱: صفحه اصلی (/)

در View Source (Ctrl+U):
```html
<html lang="fa" dir="rtl">
<title>ردیف ایسیو | تعمیرات تخصصی ECU خودرو</title>
<meta name="description" content="...">
<script type="application/ld+json">{ "@type": "LocalBusiness" }</script>
```

---

### ✅ تست ۲: صفحه لیست دانشنامه (/wiki)

- Title: "دانشنامه ECU | ردیف ایسیو"
- لیست مقالات، جستجو، فیلتر کار می‌کنند

---

### ✅ تست ۳: صفحه تک مقاله (/wiki/[slug])

در View Source:
```html
<title>عنوان مقاله | ردیف ایسیو</title>
<meta name="description" content="خلاصه مقاله...">
<meta property="og:title" content="...">
<link rel="canonical" href="https://radif-ecu.ir/wiki/slug">
<script type="application/ld+json">{ "@type": "Article" }</script>
```

---

### ✅ تست ۴: Sitemap.xml

http://localhost:3000/sitemap.xml باید لیست URLها نمایش دهد.

---

### ✅ تست ۵: Robots.txt

http://localhost:3000/robots.txt باید شامل:
```
Disallow: /admin/
Sitemap: https://radif-ecu.ir/sitemap.xml
```

---

## 🔍 ابزارهای تست

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Meta Tags Checker:** https://metatags.io/
3. **Lighthouse (Chrome DevTools)** → SEO Score باید بالای 90 باشد

---

## 🎯 معیار موفقیت

- ✅ Meta tags در source code
- ✅ محتوای مقاله در source HTML (نه loading)
- ✅ Sitemap.xml کامل
- ✅ Schema Markup معتبر
- ✅ Lighthouse SEO Score بالای 90
