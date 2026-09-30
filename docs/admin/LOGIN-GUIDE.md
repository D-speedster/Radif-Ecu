# 🔐 راهنمای ورود به پنل ادمین

## 🚀 دستورات اجرا

### 1. Backend:
```bash
cd backend
npm run dev
```
**Status:** Running on http://localhost:5000  
**Database:** MongoDB Atlas

### 2. Frontend:
```bash
npm run dev
```
**Status:** Running on http://localhost:3000

---

## 🔑 مراحل ورود

1. باز کردن: http://localhost:3000/auth
2. وارد کردن اطلاعات ادمین
3. کلیک روی "ورود به پنل"
4. Redirect به داشبورد: http://localhost:3000/admin

---

## 📊 دسترسی‌های پنل ادمین

- **داشبورد:** http://localhost:3000/admin  
- **مدیریت نوبت‌ها:** http://localhost:3000/admin/appointments  
- **پیام‌های تماس:** http://localhost:3000/admin/messages  
- **مدیریت دانشنامه:** http://localhost:3000/admin/wiki  
- **مقاله جدید:** http://localhost:3000/admin/wiki/new  

---

## 🔧 ساخت Admin جدید

```bash
cd backend
node scripts/createAdmin.js
```

---

## 🗄️ اطلاعات دیتابیس

**نوع:** MongoDB Atlas (Cloud)

**Collections:**
- `users` - کاربران و ادمین‌ها
- `appointments` - نوبت‌های رزرو شده
- `articles` - مقالات دانشنامه
- `contactmessages` - پیام‌های فرم تماس

---

## 🐛 مشکلات رایج

### خطای "Invalid credentials":
- مطمئن شوید Backend بالا است
- Console log برای دیدن خطای دقیق

### خطای CORS:
- `CLIENT_URL` در `backend/.env` باید `http://localhost:3000` باشد
- Backend را restart کنید

### خطای Database connection:
- اینترنت متصل باشد
- MongoDB Atlas IP whitelist را بررسی کنید
