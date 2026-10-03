# 🗄️ راهنمای پیکربندی MongoDB Atlas

## ✅ مراحل انجام شده:

### 1️⃣ اطلاعات Atlas شما:
```
Connection String: mongodb+srv://mrspeed717_db_user:<db_password>@cluster0.rj18c6s.mongodb.net/?appName=Cluster0
Database Name: radif-ecu
```

---

## 📝 مراحلی که باید انجام دهید:

### مرحله 1: دریافت رمز عبور دیتابیس

1. به **MongoDB Atlas** بروید: https://cloud.mongodb.com
2. وارد پروژه خود شوید
3. از منوی سمت چپ: **Database Access** را انتخاب کنید
4. کاربر `mrspeed717_db_user` را پیدا کنید
5. اگر رمز را فراموش کرده‌اید:
   - روی **Edit** کلیک کنید
   - **Edit Password** را بزنید
   - یک رمز قوی بسازید (حداقل 12 کاراکتر، ترکیبی از حروف، اعداد و علائم)
   - رمز را یادداشت کنید (⚠️ بسیار مهم!)

---

### مرحله 2: تنظیم Network Access (IP Whitelist)

1. از منوی سمت چپ: **Network Access** را انتخاب کنید
2. **Add IP Address** را بزنید
3. یکی از این گزینه‌ها:
   
   **گزینه A - دسترسی از همه جا (توصیه نمی‌شود برای production):**
   ```
   0.0.0.0/0  (Allow access from anywhere)
   ```
   
   **گزینه B - فقط IP سرور Vercel (امن‌تر):**
   - IP های Vercel را اضافه کنید
   - می‌توانید بعداً IP دقیق را از لاگ‌های Vercel پیدا کنید
   
   **گزینه C - IP محلی + Vercel:**
   - IP عمومی خودتان (برای development محلی)
   - IP های Vercel

4. **Confirm** را بزنید

---

### مرحله 3: بروزرسانی فایل `.env`

فایل `backend/.env` را باز کنید و خط `MONGO_URI` را این‌طور تنظیم کنید:

```env
MONGO_URI=mongodb+srv://mrspeed717_db_user:YOUR_PASSWORD_HERE@cluster0.rj18c6s.mongodb.net/radif-ecu?retryWrites=true&w=majority&appName=Cluster0
```

**⚠️ نکات مهم:**
- `YOUR_PASSWORD_HERE` را با رمز واقعی جایگزین کنید
- اگر رمز شامل کاراکترهای خاص است (`@`, `#`, `!`, `/`, `:`) باید URL encode شوند:
  - مثال: `p@ssw0rd!` → `p%40ssw0rd%21`
  - ابزار آنلاین: https://www.urlencoder.org/

---

### مرحله 4: تست اتصال

در terminal اجرا کنید:

```powershell
# متوقف کردن backend (اگر در حال اجراست)
# Ctrl+C

# شروع مجدد با تنظیمات جدید
cd backend
npm start
```

اگر اتصال موفق بود، باید این پیام را ببینید:
```
✅ Connected to MongoDB
Server running on port 5000
```

---

### مرحله 5: انتقال داده‌های محلی به Atlas (اختیاری)

اگر داده‌هایی در MongoDB محلی دارید و می‌خواهید منتقل کنید:

```powershell
# Export از MongoDB محلی
mongodump --uri="mongodb://localhost:27017/radif" --out=./backup

# Import به Atlas
mongorestore --uri="mongodb+srv://mrspeed717_db_user:YOUR_PASSWORD@cluster0.rj18c6s.mongodb.net/radif-ecu" ./backup/radif
```

**یا ساده‌تر:** مقاله "رفع ناک ماشین" را دوباره منتشر کنید:
```powershell
node quick-publish.js
```

---

## 🚀 پیکربندی برای Vercel

### فایل Environment Variables در Vercel:

1. به **Vercel Dashboard** بروید
2. پروژه خود را انتخاب کنید
3. **Settings** → **Environment Variables**
4. این متغیرها را اضافه کنید:

```env
# Backend Environment Variables (در Vercel باید جداگانه تنظیم شوند)

MONGO_URI=mongodb+srv://mrspeed717_db_user:YOUR_PASSWORD@cluster0.rj18c6s.mongodb.net/radif-ecu?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=uIX0BoHdXcBncu6z/gkDEBUVvQYgbyV4oCKtqipbVjo=

NODE_ENV=production

CLIENT_URL=https://your-domain.vercel.app

COOKIE_SECURE=true

PORT=5000

ALLOW_REGISTRATION=false
```

5. **Save** را بزنید
6. پروژه را **Redeploy** کنید

---

## 🔧 عیب‌یابی مشکلات رایج

### خطا: "MongoServerError: bad auth"
✅ **حل:** رمز عبور اشتباه است. دوباره بررسی کنید و URL encode را فراموش نکنید.

### خطا: "connection timeout"
✅ **حل:** IP شما در Network Access نیست. IP را اضافه کنید یا `0.0.0.0/0` را تست کنید.

### خطا: "ENOTFOUND cluster0.rj18c6s.mongodb.net"
✅ **حل:** اینترنت قطع است یا DNS مشکل دارد. VPN را تست کنید.

### خطا: "not authorized on admin"
✅ **حل:** نام database در connection string اشتباه است. از `radif-ecu` استفاده کنید.

---

## 📊 مانیتورینگ و مدیریت

### مشاهده داده‌ها در Atlas:

1. **Database** → **Browse Collections**
2. Database: `radif-ecu`
3. Collections: `users`, `articles`, `appointments`, `contactmessages`

### بررسی Performance:

1. **Metrics** → مشاهده نمودارها
2. **Performance Advisor** → پیشنهادات بهینه‌سازی

### Backup خودکار:

1. **Backup** → فعال‌سازی Cloud Backup
2. تنظیم زمان‌بندی (روزانه، هفتگی)

---

## ✅ چک‌لیست نهایی

- [ ] رمز عبور دیتابیس را دریافت کردم
- [ ] IP را در Network Access اضافه کردم
- [ ] فایل `backend/.env` را بروزرسانی کردم
- [ ] backend را restart کردم
- [ ] اتصال موفقیت‌آمیز بود (پیام "Connected to MongoDB")
- [ ] مقاله "رفع ناک ماشین" را منتشر کردم
- [ ] Environment Variables را در Vercel تنظیم کردم
- [ ] پروژه را در Vercel redeploy کردم

---

## 🆘 نیاز به کمک؟

اگر در هر مرحله‌ای مشکل داشتید، خطای دقیق را به من نشان دهید تا کمک کنم! 🚀
