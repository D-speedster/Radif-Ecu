// منبع واحد اطلاعات کسب‌وکار. Navbar، Footer، CTA، تماس، Schema و نوار چسبان همه از اینجا می‌خوانند.

export const business = {
  name: 'ردیف ایسیو',
  phone: '09966500516',               // فرمت محلی برای tel:
  phoneDisplay: '۰۹۹۶-۶۵۰-۰۵۱۶',
  whatsapp: '989966500516',           // بدون + و صفر اول؛ برای wa.me
  email: 'info@radif-ecu.ir',         // ⚠️ اگر ایمیل واقعی دیگری دارید، اینجا عوض کنید
  city: 'تهران',
  address: 'تهران، جنت‌آباد شمالی، گلزار شرقی، پلاک ۲۴',
  street: 'جنت‌آباد شمالی، گلزار شرقی، پلاک ۲۴',
  hours: 'شنبه تا پنج‌شنبه: ۱۲ تا ۲۰',
  hoursShort: 'شنبه تا پنج‌شنبه ۱۲ تا ۲۰',
  opens: '12:00',
  closes: '20:00',
  url: 'https://radif-ecu.ir',         // ⚠️ فقط اگر دامنه واقعاً مال شماست
} as const;

export const telHref = `tel:${business.phone}`;

export const whatsappHref = (text = '') =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
