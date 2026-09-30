# 🔐 تست پنل ادمین - فاز ۴

## 📋 چک‌لیست تست کامل

### ۱. احراز هویت (Authentication)

**URL:** http://localhost:3000/auth

- [ ] باز کردن صفحه لاگین
- [ ] فیلدهای خالی → کلیک "ورود" → باید خطا نشان بدهد
- [ ] نام کاربری/رمز نادرست → باید پیغام خطا نشان بدهد
- [ ] نام کاربری و رمز صحیح → باید به `/admin` هدایت شود
- [ ] Redirect: اگر قبلاً لاگین کرده → مستقیم به `/admin` برود

#### Guard (محافظ مسیرها)
- [ ] بدون لاگین، دسترسی به `/admin` → Redirect به `/auth`
- [ ] بعد از لاگین، دسترسی به همه صفحات پنل

#### خروج
- [ ] کلیک دکمه "خروج" در Sidebar
- [ ] Redirect به `/auth`

---

### ۲. داشبورد (Dashboard)

**URL:** http://localhost:3000/admin

- [ ] نمایش KPI Cards (نوبت امروز، در انتظار تأیید، مقالات، پیام‌های جدید)
- [ ] لیست ۵ نوبت آخر با Badge رنگی وضعیت
- [ ] Quick Actions لینک به صفحات

---

### ۳. مدیریت نوبت‌ها

**URL:** http://localhost:3000/admin/appointments

- [ ] فیلترها: همه / در انتظار / در حال انجام / انجام شده / لغو شده
- [ ] تغییر وضعیت نوبت
- [ ] حذف نوبت با Confirm
- [ ] تاریخ به شمسی تبدیل شده

---

### ۴. مدیریت پیام‌های تماس

**URL:** http://localhost:3000/admin/messages

- [ ] فیلترها: همه / جدید / خوانده شده / پاسخ داده شده
- [ ] تغییر وضعیت پیام
- [ ] دکمه "پاسخ ایمیل" → mailto:
- [ ] حذف پیام با Confirm

---

### ۵. مدیریت دانشنامه

**URL:** http://localhost:3000/admin/wiki

- [ ] آمار مقالات (منتشر شده / پیش‌نویس / خصوصی)
- [ ] Toggle منتشر/پیش‌نویس
- [ ] دکمه ویرایش، مشاهده، حذف
- [ ] دکمه "مقاله جدید" → `/admin/wiki/new`

---

### ۶. افزودن مقاله جدید

**URL:** http://localhost:3000/admin/wiki/new

- [ ] Auto-generate slug از عنوان
- [ ] TipTap Editor با Toolbar کامل
- [ ] Validation فیلدهای اجباری
- [ ] دکمه "ذخیره پیش‌نویس" و "انتشار"

---

### ۷. ویرایش مقاله

**URL:** http://localhost:3000/admin/wiki/edit/:id

- [ ] بارگذاری داده‌های موجود
- [ ] ویرایش و ذخیره

---

## 🔌 Endpoints مورد استفاده

```
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/appointments
PATCH  /api/appointments/:id/status
DELETE /api/appointments/:id

GET    /api/messages
PATCH  /api/messages/:id/status
DELETE /api/messages/:id

GET    /api/articles
POST   /api/articles
PATCH  /api/articles/:id
DELETE /api/articles/:id
```

---

## 🎨 تست UI/UX

- [ ] Dark Theme در تمام صفحات
- [ ] Responsive: موبایل / تبلت / دسکتاپ
- [ ] RTL در همه متن‌ها
- [ ] Loading States
