# 🔗 لینک‌های تست سایت

> پورت پیش‌فرض: `http://localhost:3000`
> Backend: `http://localhost:5000`

## صفحه اصلی
- http://localhost:3000

## سیستم رزرو نوبت
- فرم رزرو: http://localhost:3000/booking
- با شماره از Hero: http://localhost:3000/booking?phone=09123456789
- صفحه موفقیت: http://localhost:3000/booking/success?code=TEST12345
- پیگیری: http://localhost:3000/booking/track
- پیگیری با کد: http://localhost:3000/booking/track?code=TEST12345

## دانشنامه (Wiki)
- لیست مقالات: http://localhost:3000/wiki
- مقاله (نمونه): http://localhost:3000/wiki/ecu-چیست

## تماس با ما
- http://localhost:3000/contact

## SEO
- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt

## پنل ادمین
- ورود: http://localhost:3000/auth
- داشبورد: http://localhost:3000/admin
- نوبت‌ها: http://localhost:3000/admin/appointments
- پیام‌ها: http://localhost:3000/admin/messages
- دانشنامه: http://localhost:3000/admin/wiki
- مقاله جدید: http://localhost:3000/admin/wiki/new

---

## ✅ Checklist تست سریع (5 دقیقه)

1. **صفحه اصلی:** Hero با تصویر پس‌زمینه
2. **Booking:** فرم 2 مرحله‌ای → ثبت نوبت → کد پیگیری
3. **Success:** `?code=TEST123` → Copy کد
4. **Track:** `?code=TEST123` → مشاهده جزئیات
5. **Wiki:** لیست مقالات → جستجو و فیلتر
6. **Contact:** فرم تماس
