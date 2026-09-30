# ردیف ایسیو - راهنمای فارسی

## 🚀 راه‌اندازی پروژه

### پیش‌نیازها
- Node.js نسخه 20 یا بالاتر
- npm

### نصب Dependencies
```bash
npm install
```

### اجرای پروژه در حالت Development

```bash
npm run dev
```

سایت روی **http://localhost:3000** اجرا می‌شود.

#### اگر خطای EACCES در Windows گرفتید

**گزینه A: PowerShell به عنوان Administrator**

**گزینه B: پورت دیگر**
```bash
npm run dev -- -p 3003
```

**گزینه C: IPv4 صریح**
```bash
set HOSTNAME=127.0.0.1 && npm run dev
```

### Build برای Production
```bash
npm run build
npm start
```

---

## 📁 ساختار پروژه

```
Radif-Ecu/
├── src/
│   ├── app/          # Pages و Routes
│   ├── components/   # کامپوننت‌ها
│   ├── context/      # AuthContext
│   ├── lib/          # api.ts, utils.ts
│   └── types/        # TypeScript types
├── public/
│   ├── fonts/        # YekanBakh woff2
│   └── images/       # hero.jpg
├── backend/          # Express + MongoDB
└── docs/             # مستندات
```

---

## 🎨 Design System

### رنگ‌ها
- **Background**: `#252525`
- **Surface**: `#545454`
- **Primary**: `#7d7d7d`
- **Accent**: `#DC2626`
- **Text**: `#CFCFCF`

### فونت
- **YekanBakh**: فارسی (لوکال از `public/fonts/`)
- **Vazirmatn**: بارگذاری از CDN (در `layout.tsx`)

---

## 🔗 API Configuration

فایل `.env.local` (یا در Docker از `NEXT_PUBLIC_API_URL`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📱 صفحات

- `/` - صفحه اصلی
- `/contact` - تماس با ما
- `/wiki` - دانشنامه
- `/booking` - رزرو نوبت
- `/admin` - پنل ادمین

---

## 🐛 عیب‌یابی

### خطای "EACCES: permission denied"
پورت دیگری استفاده کنید: `npm run dev -- -p 4000`

### خطای "Port already in use"
```bash
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### خطای Build
```bash
rmdir /s /q .next
npm install
npm run build
```

---

## 📞 پشتیبانی
- ایمیل: info@radif-ecu.ir
