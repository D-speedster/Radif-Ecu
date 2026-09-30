# تست سیستم رزرو نوبت

## ✅ چک‌لیست تست دستی

### 1. فرم رزرو سریع در Hero (صفحه اصلی)

**URL:** http://localhost:3000

- [ ] Validation شماره تماس خالی → باید خطا نشان بدهد
- [ ] شماره معتبر → باید به `/booking?phone=09xxxxxxxxx` هدایت شود

---

### 2. مرحله ۱: اطلاعات شخصی

**URL:** http://localhost:3000/booking?phone=09123456789

- [ ] شماره تماس خودکار پر شده باشد
- [ ] Validation: نام، شماره، مدل خودرو، نوع خدمت
- [ ] کلیک "مرحله بعد" → رفتن به مرحله ۲

---

### 3. مرحله ۲: انتخاب تاریخ و ساعت

- [ ] Step Indicator: مرحله ۱ تیک، مرحله ۲ هایلایت
- [ ] Validation: تاریخ و ساعت اجباری
- [ ] دکمه "مرحله قبل" → برگشت با حفظ داده

---

### 4. صفحه موفقیت

**URL:** http://localhost:3000/booking/success?code=TEST12345

- [ ] کد پیگیری نمایش داده می‌شود
- [ ] دکمه Copy کد
- [ ] دکمه "مشاهده وضعیت نوبت" → `/booking/track?code=TEST12345`

---

### 5. صفحه Tracking

**URL:** http://localhost:3000/booking/track

- [ ] جستجوی دستی با کد پیگیری
- [ ] جستجوی خودکار از URL: `/booking/track?code=...`
- [ ] نمایش وضعیت، خودرو، خدمت، تاریخ شمسی، ساعت

---

## 🎨 تست UI/UX

- [ ] Responsive در موبایل (375px)
- [ ] RTL و فونت فارسی
- [ ] فیلد شماره تماس LTR است

---

## 🔧 API Calls

- [ ] `POST /api/appointments` برای ثبت نوبت
- [ ] `GET /api/appointments/track/:code` برای پیگیری

---

## 🐛 مشکلات شناخته شده

### مشکل EPERM در `.next/trace`:
```
[Error: EPERM: operation not permitted, open '.next\trace']
```
این یک warning است و روی عملکرد تاثیر ندارد.
