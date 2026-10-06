# 🚀 دستورالعمل آپدیت VPS

## وضعیت فعلی
- Frontend جدید روی Vercel deploy شده (automatic)
- Backend روی VPS نیاز به pull و restart دارد
- Landing pages نمایش داده نمی‌شوند تا backend آپدیت بشه

## ✅ تغییرات انجام شده (Git)

**Commit های جدید:**
- `ed1bb85` - حذف فایل‌های امنیتی و credentials
- `51cc013` - رفع مشکل نمایش landing pages

**Backend تغییرات:**
- Model: LandingPage structure ساده شده (flat fields)
- Controller: پشتیبانی از metaTitle, metaDescription, keywords

**Frontend تغییرات:**
- حذف پشتیبانی از sections و schema
- نمایش ساده content با WYSIWYG

---

## 📋 دستورات برای VPS (به ترتیب)

### 🔴 مرحله 1: امنیت - تغییر رمز ادمین

```bash
# SSH to VPS
ssh root@91.107.157.82

# Go to backend directory
cd ~/Radif-Ecu/backend

# Pull latest changes (includes changeAdminPassword.js script)
git pull

# Run password change script
node scripts/changeAdminPassword.js
```

**در اسکریپت:**
- Username: `speedster` (یا فقط Enter)
- رمز جدید قوی بساز: مثلاً `EcuTehran@2026!Secure`
- تایید رمز

---

### 🔵 مرحله 2: Restart Backend

```bash
# Restart PM2 process
pm2 restart radif-backend

# Check logs to verify it's working
pm2 logs radif-backend --lines 50
```

**چیزی که باید ببینی:**
```
✅ Connected to MongoDB
Server running on port 5000
```

**اگه error دیدی:**
```bash
# Check detailed logs
pm2 logs radif-backend

# If needed, restart with fresh logs
pm pm2 stop radif-backend
pm2 delete radif-backend
pm2 start server.js --name radif-backend
```

---

### 🟢 مرحله 3: تست

```bash
# Test landing page API (از VPS)
curl http://localhost:5000/api/landing-pages/amir9900a
```

**باید response ببینی مثل:**
```json
{
  "success": true,
  "landingPage": {
    "_id": "...",
    "title": "...",
    "slug": "amir9900a",
    "content": "...",
    "metaTitle": "...",
    "published": true
  }
}
```

---

### 🟡 مرحله 4: تست از خارج VPS

از کامپیوتر خودت:

```powershell
# Test from outside (Windows PowerShell)
curl http://91.107.157.82:5000/api/landing-pages/amir9900a
```

یا برو تو مرورگر:
- http://91.107.157.82:5000/api/landing-pages/amir9900a

---

### 🟣 مرحله 5: تست سایت اصلی

بعد از ۱-۲ دقیقه (Vercel revalidation):
- https://www.radif-ecu.ir/page/amir9900a

باید صفحه رو ببینی با محتوای WYSIWYG.

---

## 🔧 عیب‌یابی

### مشکل: `Cannot read property 'sections'`
**علت:** Backend هنوز pull نشده
**راه‌حل:** 
```bash
cd ~/Radif-Ecu/backend
git pull
pm2 restart radif-backend
```

### مشکل: `404 Not Found`
**علت:** Landing page در دیتابیس نیست یا published نیست
**راه‌حل:**
```bash
# Check database
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(async () => { const LandingPage = require('./models/LandingPage'); const pages = await LandingPage.find({}); console.log(pages); process.exit(); });"
```

### مشکل: `500 Internal Server Error`
**علت:** Backend crash کرده
**راه‌حل:**
```bash
# Check logs
pm2 logs radif-backend --lines 100

# Restart if needed
pm2 restart radif-backend
```

### مشکل: صفحه قدیمی رو نشون میده
**علت:** Cache Vercel
**راه‌حل:** صبر کن ۱-۲ دقیقه یا:
```bash
# Clear cache manually (اگه access به Vercel داری)
vercel --prod
```

---

## 📊 چک‌لیست نهایی

- [ ] SSH به VPS زدم
- [ ] `git pull` در backend انجام شد
- [ ] رمز ادمین تغییر کرد (`node scripts/changeAdminPassword.js`)
- [ ] Backend restart شد (`pm2 restart radif-backend`)
- [ ] API endpoint تست شد (curl localhost:5000/api/landing-pages/...)
- [ ] API از خارج تست شد (91.107.157.82:5000)
- [ ] سایت اصلی تست شد (radif-ecu.ir/page/...)
- [ ] با رمز جدید login کردم

---

## 🔐 یادآوری امنیتی

**بعد از انجام کارها:**
1. رمز جدید رو یه جای امن ذخیره کن (password manager)
2. Repository رو private کن در GitHub
3. فایل `SECURITY-FIX-URGENT.md` رو بخون
4. این فایل (`VPS-UPDATE-INSTRUCTIONS.md`) رو پاک کن

---

## ❓ سوالات متداول

**Q: چرا باید رمز رو الان عوض کنم؟**
A: چون رمز قدیمی توی GitHub public بوده و هر کسی می‌تونسته ببینه.

**Q: Backend restart چقدر طول می‌کشه؟**
A: معمولاً کمتر از 5 ثانیه. اگه بیشتر طول کشید، logs رو چک کن.

**Q: آیا سایت down میشه؟**
A: نه! PM2 restart خیلی سریعه و downtime نداره.

**Q: اگه مشکلی پیش اومد چی کار کنم؟**
A: اول `pm2 logs radif-backend` رو بررسی کن. اگه حل نشد، بگو تا کمک کنم.

---

## 📞 پشتیبانی

اگه هر مشکلی پیش اومد یا سوالی داشتی، بگو.

**این فایل رو پاک کن بعد از تکمیل موفقیت‌آمیز آپدیت.**
