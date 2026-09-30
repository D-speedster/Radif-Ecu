# ✅ خلاصه فاز ۲: دانشنامه + SEO

## 🎯 هدف فاز ۲

ساخت موتور قدرتمند SEO — هر مقاله = یک صفحه برای گوگل.

---

## ✅ کارهای انجام شده

### ۱. Backend
- اضافه کردن فیلد `slug` به مدل Article
- تولید خودکار slug از عنوان فارسی
- endpoint جدید: `GET /articles/:slug`

→ جزئیات: [`docs/development/BACKEND-CHANGES.md`](../development/BACKEND-CHANGES.md)

---

### ۲. صفحه لیست دانشنامه (`/wiki`)

- جستجوی زنده (live search)
- فیلتر دسته‌بندی
- گرید responsive
- دریافت داینامیک از API

---

### ۳. صفحه تک مقاله (`/wiki/[slug]`)

**ویژگی‌های SEO:**
- Server Side Rendering (SSR)
- generateMetadata — meta tags اختصاصی هر مقاله
- Schema Markup (Article)
- Open Graph Tags
- Canonical URL
- Fallback: اگر slug نباشد، با _id کار می‌کند

---

### ۴. Sitemap دینامیک (`/sitemap.xml`)

- تولید خودکار از مقالات
- صفحات استاتیک + مقالات دینامیک
- Revalidate هر ساعت

---

### ۵. Robots.txt (`/robots.txt`)

- Allow: / (همه صفحات)
- Disallow: /admin/, /api/
- Sitemap URL

---

### ۶. Schema Markup

- **LocalBusiness** در `src/app/layout.tsx`
- **Article** در `src/app/wiki/[slug]/page.tsx`

---

## 🎯 معیارهای موفقیت SEO

1. محتوای مقاله در View Source (SSR کار می‌کند)
2. هر مقاله title و description اختصاصی دارد
3. Schema Markup در Google Rich Results Test معتبر است
4. Sitemap تمام صفحات را لیست می‌کند
5. Lighthouse SEO Score بالای 90

→ جزئیات تست: [`docs/seo/SEO-CHECKLIST.md`](../seo/SEO-CHECKLIST.md)
