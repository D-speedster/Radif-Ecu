# 🚗 پروژه Radif ECU - خلاصه کامل

## 📌 اطلاعات پروژه

| آیتم | مقدار |
|------|-------|
| **نام** | ردیف ایسیو (Radif ECU) |
| **دامنه** | radif-ecu.ir |
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS 3 |
| **Backend** | Node.js + Express + MongoDB |
| **زبان** | فارسی (RTL) |

---

## ✅ فازهای تکمیل شده

### فاز ۱: پایه و صفحات عمومی ✅
- راه‌اندازی Next.js 14 با TypeScript و Tailwind 3
- تنظیم RTL و فونت YekanBakh (لوکال)
- Design System (رنگ‌ها، کامپوننت‌های پایه)
- Layout اصلی: Navbar + Footer
- صفحه اصلی با Hero، خدمات، چرا ما، آخرین مقالات، CTA
- صفحه تماس با فرم

### فاز ۲: دانشنامه + SEO ✅
- صفحه لیست دانشنامه با Search و Filter
- صفحه تک مقاله با SSR کامل
- generateMetadata برای هر مقاله
- sitemap.xml دینامیک
- robots.txt
- Schema Markup (LocalBusiness + Article)

### فاز ۳: رزرو نوبت آنلاین ✅
- Multi-Step Form (2 مرحله)
- مرحله ۱: اطلاعات شخصی + نوع خدمت
- مرحله ۲: انتخاب تاریخ شمسی + ساعت
- صفحه Success با کد پیگیری
- صفحه Tracking

### فاز ۴: پنل ادمین ✅
- سیستم احراز هویت (Login + AuthContext + Guard)
- داشبورد با KPI Cards
- مدیریت نوبت‌ها، پیام‌ها، دانشنامه
- TipTap Editor کامل

---

## 📁 ساختار پروژه

```
Radif-Ecu/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/page.tsx
│   │   ├── booking/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── wiki/page.tsx
│   │   ├── wiki/[slug]/page.tsx
│   │   ├── admin/layout.tsx
│   │   ├── admin/page.tsx
│   │   ├── admin/appointments/page.tsx
│   │   ├── admin/messages/page.tsx
│   │   ├── admin/wiki/...
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/          — Button, Card, Badge, Input, Textarea
│   │   ├── layout/      — Navbar, Footer
│   │   ├── home/        — HeroSection, ServicesSection, ...
│   │   ├── wiki/        — ArticleCard, SearchBar, CategoryFilter
│   │   ├── booking/     — StepIndicator, Step1, Step2
│   │   └── admin/       — StatCard, RecentAppointments, TipTapEditor
│   ├── context/AuthContext.tsx
│   ├── lib/api.ts
│   ├── lib/utils.ts
│   └── types/index.ts
├── public/
│   ├── fonts/           — YekanBakh woff2 files
│   └── images/          — hero.jpg
├── backend/             — Express + MongoDB
└── docs/                — مستندات پروژه
```

---

## 🔌 API Endpoints

**Auth:** `POST /api/auth/login` | `GET /api/auth/me` | `POST /api/auth/logout`

**Appointments:** `GET/POST /api/appointments` | `GET /api/appointments/track/:code` | `PATCH/DELETE /api/appointments/:id`

**Articles:** `GET/POST /api/articles` | `GET /api/articles/:slug` | `PATCH/DELETE /api/articles/:id`

**Messages:** `GET/POST /api/messages` | `PATCH/DELETE /api/messages/:id`

---

## 📦 Dependencies اصلی

```json
{
  "next": "14.2.18",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "axios": "1.x",
  "jalaali-js": "latest",
  "lucide-react": "latest",
  "@tiptap/react": "latest"
}
```

---

## 🚀 دستورات اجرا

```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Production server
npm run lint     # Lint check
```

---

## 🔒 امنیت

- JWT در HTTP-only Cookie
- Guard برای مسیرهای ادمین
- CORS configuration در Backend
- Input validation در Frontend و Backend

---

## 🐛 Issues & Solutions

- **Tailwind 4:** Downgrade به Tailwind 3
- **Next.js 16 permission error:** Downgrade به Next.js 14
- **jalaali-js import:** استفاده از `import * as jalaali`
