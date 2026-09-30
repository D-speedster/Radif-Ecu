# 🧪 تست سریع SEO

## دستورات تست

```bash
# اجرای پروژه
npm run dev
```

### بررسی Sitemap
http://localhost:3000/sitemap.xml

### بررسی Robots
http://localhost:3000/robots.txt

### تست Schema Markup مقاله
1. یک مقاله باز کنید
2. راست‌کلیک → View Page Source (Ctrl+U)
3. جستجو: `"@type": "Article"`
4. اگر پیدا شد ✅ SEO کار می‌کنه!

---

## 🎯 نتیجه تست

| آیتم | وضعیت |
|------|-------|
| صفحه اصلی | ⬜ |
| لیست دانشنامه | ⬜ |
| صفحه مقاله (SSR) | ⬜ |
| Meta Tags | ⬜ |
| Schema Markup | ⬜ |
| Sitemap.xml | ⬜ |
| Robots.txt | ⬜ |
