# برنامه پیاده‌سازی SEO - وضعیت فعلی و موارد باقیمانده

## خلاصه اجرایی

بر اساس بررسی دقیق کدبیس، **موارد زیر از طرح SEO پیاده‌سازی شده‌اند:**

### ✅ موارد پیاده‌سازی شده (۵ مورد از ۱۲):

1. **✅ مرحله ۱: Homepage metadata و JSON-LD** - کامل شده
   - `src/app/page.tsx` دارای metadata کامل و LocalBusiness JSON-LD schema است

2. **✅ مرحله ۵: بهبود Wiki article schemas** - کامل شده  
   - `src/app/wiki/[slug]/page.tsx` دارای Article JSON-LD schema و metadata کامل است
   - **نکته:** از Article استفاده شده نه TechArticle، و BreadcrumbList وجود ندارد

3. **✅ مرحله ۶: Service schemas** - جزئی پیاده شده
   - `src/components/ServicePage.tsx` دارای Service JSON-LD schema است
   - این schema برای هر دو صفحه `/remap` و `/repair-ecu` اعمال می‌شود

4. **✅ مرحله ۸: Sitemap optimization** - کامل شده
   - `src/app/sitemap.ts` دارای صفحات استاتیک و مقالات است
   - **نکته:** صفحه `/booking` در sitemap وجود ندارد

5. **✅ مرحله ۹: Robots.txt** - کامل شده
   - `src/app/robots.ts` صحیح کار می‌کند

### ❌ موارد پیاده‌سازی نشده (۷ مورد از ۱۲):

1. **❌ مرحله ۲: Contact metadata** - نشده
2. **❌ مرحله ۳: Booking metadata** - نشده  
3. **❌ مرحله ۴: Wiki list metadata** - نشده
4. **❌ مرحله ۷: next.config.js optimization** - نشده
5. **❌ مرحله ۱۰: .env.example** - نشده (در root وجود ندارد)
6. **❌ مرحله ۱۱: noindex برای صفحات داخلی** - نشده
7. **❌ مرحله ۱۲: تست نهایی** - نشده

---

## برنامه پیاده‌سازی (Implementation Plan)

این برنامه فقط موارد **پیاده‌سازی نشده** را پوشش می‌دهد. ترتیب اجرا بر اساس وابستگی‌ها و اولویت SEO است.

---

### ⬜ آیتم ۱: جداسازی client logic در صفحه Contact و اضافه کردن metadata

**چرا:** صفحه `contact/page.tsx` یک client component است ('use client') و نمی‌تواند مستقیماً metadata export کند. باید با wrapper pattern به server component تبدیل شود.

**فایل‌های تغییر:**
- ایجاد: `src/components/contact/ContactForm.tsx` (client component جدید)
- تغییر: `src/app/contact/page.tsx` (تبدیل به server component wrapper با metadata)

**تغییرات:**

1. ایجاد `src/components/contact/ContactForm.tsx`:
   - کل محتوای فعلی `contact/page.tsx` (از 'use client' تا انتها) را به این فایل منتقل کنید
   - export default ContactForm

2. بازنویسی `src/app/contact/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     ```typescript
     export const metadata: Metadata = {
       title: 'تماس با ما | مشاوره رایگان تعمیر و ریمپ ECU',
       description: `برای مشاوره رایگان در تهران با ما تماس بگیرید. آدرس: ${business.address}، تلفن: ${business.phoneDisplay}، ${business.hours}`,
       keywords: ['تماس', 'مشاوره رایگان', 'آدرس ردیف ایسیو', 'تلفن', 'تهران'],
       openGraph: {
         title: 'تماس با ما | ردیف ایسیو',
         description: 'برای مشاوره رایگان تعمیر و ریمپ ECU با ما در تماس باشید',
         url: `${business.url}/contact`,
         type: 'website',
         locale: 'fa_IR',
       },
       twitter: {
         card: 'summary',
         title: 'تماس با ما | ردیف ایسیو',
         description: 'برای مشاوره رایگان تعمیر و ریمپ ECU با ما در تماس باشید',
       },
       alternates: {
         canonical: `${business.url}/contact`,
       },
     };
     ```
   - import ContactForm from '@/components/contact/ContactForm'
   - return `<ContactForm />`

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/contact
- مشاهده source (Ctrl+U) و بررسی وجود metadata در `<head>`
- پر کردن و ارسال فرم تماس و اطمینان از کار کردن آن
- بررسی console برای خطاهای hydration

**نکات مهم:**
- UI و رفتار فرم نباید تغییر کند
- همه state management و event handlers در ContactForm باقی می‌مانند
- RTL layout و styling دست‌نخورده باقی می‌ماند

---

### ⬜ آیتم ۲: جداسازی client logic در صفحه Booking و اضافه کردن metadata

**چرا:** صفحه `booking/page.tsx` یک client component است و نمی‌تواند metadata export کند.

**فایل‌های تغییر:**
- ایجاد: `src/components/booking/BookingForm.tsx` (client component جدید)
- تغییر: `src/app/booking/page.tsx` (تبدیل به server component wrapper با metadata)

**تغییرات:**

1. ایجاد `src/components/booking/BookingForm.tsx`:
   - کل محتوای فعلی `booking/page.tsx` شامل component BookingForm و wrapper Suspense را به این فایل منتقل کنید
   - export default BookingForm

2. بازنویسی `src/app/booking/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     ```typescript
     export const metadata: Metadata = {
       title: 'رزرو نوبت آنلاین | تعمیر و ریمپ ECU',
       description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو. انتخاب تاریخ و ساعت دلخواه. دریافت کد پیگیری.',
       keywords: ['رزرو نوبت', 'نوبت آنلاین', 'تعمیر ECU', 'ریمپ', 'دیاگ خودرو', 'کد پیگیری'],
       openGraph: {
         title: 'رزرو نوبت آنلاین | ردیف ایسیو',
         description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو',
         url: `${business.url}/booking`,
         type: 'website',
         locale: 'fa_IR',
       },
       twitter: {
         card: 'summary',
         title: 'رزرو نوبت آنلاین | ردیف ایسیو',
         description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو',
       },
       alternates: {
         canonical: `${business.url}/booking`,
       },
     };
     ```
   - import BookingForm from '@/components/booking/BookingForm'
   - return `<BookingForm />`

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/booking
- بازدید از http://localhost:3000/booking?phone=09123456789 (تست query param)
- مشاهده source و بررسی metadata
- تست multi-step form: مرحله ۱ → مرحله ۲ → برگشت → ارسال
- بررسی console برای خطاهای hydration

**نکات مهم:**
- Suspense wrapper باید در BookingForm باقی بماند
- useSearchParams و useRouter در client component کار می‌کنند
- state management فرم نباید تغییر کند

---

### ⬜ آیتم ۳: جداسازی client logic در صفحه Wiki list و اضافه کردن metadata

**چرا:** صفحه `wiki/page.tsx` یک client component است برای جستجو و فیلترینگ.

**فایل‌های تغییر:**
- ایجاد: `src/components/wiki/WikiList.tsx` (client component جدید)
- تغییر: `src/app/wiki/page.tsx` (تبدیل به server component wrapper با metadata)

**تغییرات:**

1. ایجاد `src/components/wiki/WikiList.tsx`:
   - کل محتوای فعلی `wiki/page.tsx` را به این فایل منتقل کنید
   - export default WikiList

2. بازنویسی `src/app/wiki/page.tsx`:
   - حذف 'use client'
   - اضافه کردن export metadata:
     ```typescript
     export const metadata: Metadata = {
       title: 'دانشنامه ECU | آموزش و مقالات تخصصی',
       description: 'آموزش‌های تخصصی، نکات کاربردی و راهنمای کامل تعمیرات ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو',
       keywords: ['دانشنامه ECU', 'آموزش تعمیر ECU', 'مقالات خودرو', 'آموزش ریمپ', 'دیاگ خودرو'],
       openGraph: {
         title: 'دانشنامه ECU | ردیف ایسیو',
         description: 'آموزش‌های تخصصی و مقالات کاربردی تعمیرات ECU',
         url: `${business.url}/wiki`,
         type: 'website',
         locale: 'fa_IR',
       },
       twitter: {
         card: 'summary_large_image',
         title: 'دانشنامه ECU | ردیف ایسیو',
         description: 'آموزش‌های تخصصی و مقالات کاربردی تعمیرات ECU',
       },
       alternates: {
         canonical: `${business.url}/wiki`,
       },
     };
     ```
   - import WikiList from '@/components/wiki/WikiList'
   - return `<WikiList />`

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/wiki
- مشاهده source و بررسی metadata
- تست جستجو در مقالات
- تست فیلتر دسته‌بندی
- کلیک روی مقاله و اطمینان از navigation

**نکات مهم:**
- همه state management (articles، filteredArticles، searchQuery، selectedCategory) در WikiList می‌ماند
- API calls و useEffect hooks دست‌نخورده باقی می‌مانند

---

### ⬜ آیتم ۴: بهبود JSON-LD schema مقالات (TechArticle + BreadcrumbList)

**چرا:** برای SEO بهتر مقالات فنی، باید از TechArticle به جای Article استفاده کنیم و BreadcrumbList اضافه کنیم.

**فایل تغییر:**
- `src/app/wiki/[slug]/page.tsx`

**تغییرات:**

1. تغییر articleSchema در component ArticlePage:
   - `@type`: تغییر از 'Article' به 'TechArticle'
   - اضافه کردن فیلدها:
     ```typescript
     articleSection: article.category,
     inLanguage: 'fa',
     wordCount: article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
     ```
   - بهبود author و publisher با اضافه کردن url:
     ```typescript
     author: {
       '@type': 'Organization',
       name: 'ردیف ایسیو',
       url: 'https://radif-ecu.ir',
     },
     publisher: {
       '@type': 'Organization',
       name: 'ردیف ایسیو',
       url: 'https://radif-ecu.ir',
       logo: {
         '@type': 'ImageObject',
         url: 'https://radif-ecu.ir/logo.png',
       },
     },
     ```

2. اضافه کردن BreadcrumbList schema:
   ```typescript
   const breadcrumbSchema = {
     '@context': 'https://schema.org',
     '@type': 'BreadcrumbList',
     itemListElement: [
       {
         '@type': 'ListItem',
         position: 1,
         name: 'خانه',
         item: 'https://radif-ecu.ir',
       },
       {
         '@type': 'ListItem',
         position: 2,
         name: 'دانشنامه',
         item: 'https://radif-ecu.ir/wiki',
       },
       {
         '@type': 'ListItem',
         position: 3,
         name: article.title,
       },
     ],
   };
   ```

3. رندر هر دو schema در JSX:
   ```tsx
   <>
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
     />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
     />
     {/* بقیه محتوا */}
   </>
   ```

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از یک مقاله، مثلاً http://localhost:3000/wiki/[slug]
- مشاهده source و بررسی وجود دو script tag با type="application/ld+json"
- کپی JSON-LD و تست در: https://search.google.com/test/rich-results
- بررسی validation برای TechArticle و BreadcrumbList

**نکات مهم:**
- wordCount تقریبی است (برای performance)
- استفاده از 'https://radif-ecu.ir' برای URLهای absolute
- BreadcrumbList آیتم آخر (article.title) بدون 'item' است

---

### ⬜ آیتم ۵: اضافه کردن صفحه booking به sitemap

**چرا:** صفحه booking در sitemap وجود ندارد ولی یک صفحه مهم برای SEO است.

**فایل تغییر:**
- `src/app/sitemap.ts`

**تغییرات:**

اضافه کردن booking به آرایه staticPages:
```typescript
{
  url: `${SITE_URL}/booking`,
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

**محل درج:** بعد از wiki و قبل از contact

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/sitemap.xml
- بررسی وجود `<url>` با loc شامل `/booking`
- بررسی priority و changeFrequency

**نکات مهم:**
- priority: 0.8 چون صفحه مهمی است (conversion page)
- changeFrequency: 'monthly' چون محتوای استاتیک است

---

### ⬜ آیتم ۶: بهینه‌سازی next.config.js (images + cache headers)

**چرا:** برای بهبود performance و cache استراتژی.

**فایل تغییر:**
- `next.config.js`

**تغییرات:**

1. اضافه کردن images config:
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     minimumCacheTTL: 60,
     remotePatterns: [
       // اگر در آینده از CDN استفاده شد، اینجا اضافه می‌شود
     ],
   },
   ```

2. اضافه کردن async headers() برای cache:
   ```javascript
   async headers() {
     return [
       {
         source: '/fonts/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
       {
         source: '/images/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ];
   },
   ```

3. محتوای نهایی:
   ```javascript
   /** @type {import('next').NextConfig} */
   
   const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:5000';
   
   const nextConfig = {
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
       minimumCacheTTL: 60,
       remotePatterns: [],
     },
     async rewrites() {
       return [{ source: '/api/:path*', destination: `${BACKEND_ORIGIN}/api/:path*` }];
     },
     async headers() {
       return [
         {
           source: '/fonts/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
         {
           source: '/images/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   
   module.exports = nextConfig;
   ```

**راستی‌آزمایی:**
```bash
npm run build
npm run start
```
- بازدید از http://localhost:3000
- باز کردن DevTools → Network tab
- بارگذاری یک تصویر از /images/ و بررسی Response Headers برای Cache-Control
- بارگذاری فونت از /fonts/ و بررسی Cache-Control

**نکات مهم:**
- immutable فقط برای assets استاتیک که hash در نام فایل دارند
- remotePatterns خالی چون همه تصاویر local هستند
- این تغییرات تأثیری روی development ندارند، فقط production

---

### ⬜ آیتم ۷: اضافه کردن noindex به صفحات داخلی (booking/success، booking/track)

**چرا:** صفحات داخلی که حاوی اطلاعات شخصی یا user-specific هستند نباید در گوگل index شوند.

**فایل‌های تغییر:**
- `src/app/booking/success/page.tsx`
- `src/app/booking/track/page.tsx`

**تغییرات:**

هر دو فایل client component هستند، پس نمی‌توانیم مستقیماً metadata export کنیم. راه‌حل: ایجاد layout.tsx در همان پوشه.

**الف) برای booking/success:**

ایجاد یا تغییر `src/app/booking/success/layout.tsx`:
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نوبت با موفقیت ثبت شد',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

**ب) برای booking/track:**

ایجاد یا تغییر `src/app/booking/track/layout.tsx`:
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پیگیری نوبت',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

**راستی‌آزمایی:**
```bash
npm run dev
```
- بازدید از http://localhost:3000/booking/success?code=ABC123
- بازدید از http://localhost:3000/booking/track
- مشاهده source و بررسی وجود `<meta name="robots" content="noindex, nofollow">`

**نکات مهم:**
- این layout‌ها فقط metadata set می‌کنند و children را render می‌کنند
- اگر layout.tsx از قبل وجود داشت، فقط metadata را اضافه کنید
- noindex و nofollow هر دو باید false باشند

---

### ⬜ آیتم ۸: ایجاد .env.example در root پروژه

**چرا:** برای مستندسازی environment variables مورد نیاز frontend.

**فایل ایجاد:**
- `.env.example` (در root: `c:\Users\speedster\Videos\ECU\.env.example`)

**محتوا:**
```env
# ══════════════════════════════════════════════════════════════
# Frontend Environment Variables (Next.js)
# ══════════════════════════════════════════════════════════════

# Site URL - برای metadata، sitemap، og:url، canonical
# در production باید به URL واقعی سایت تغییر کند
NEXT_PUBLIC_SITE_URL=https://radif-ecu.ir

# API URL - برای client-side API requests
# در development: http://localhost:5000/api
# در production: باید به API endpoint واقعی تغییر کند
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google Tag Manager ID - برای tracking و تبلیغات
# اگر ندارید، خالی بگذارید یا کامنت کنید
NEXT_PUBLIC_GTM_ID=

# ──────────────────────────────────────────────────────────────
# Build-time Variables (فقط در زمان build خوانده می‌شوند)
# ──────────────────────────────────────────────────────────────

# Backend Origin - برای rewrites در next.config.js
# در development: http://localhost:5000
# در Docker: http://backend:5000
BACKEND_ORIGIN=http://localhost:5000

# Internal API URL - برای server-side requests (sitemap، SSR)
# در development: http://localhost:5000/api
# در Docker: http://backend:5000/api
INTERNAL_API_URL=http://localhost:5000/api

# ══════════════════════════════════════════════════════════════
# نکات:
# - این فایل را commit کنید (نه .env واقعی)
# - برای استفاده، فایل .env بسازید و مقادیر را تنظیم کنید
# - متغیرهای NEXT_PUBLIC_* در client قابل دسترسی هستند
# - متغیرهای بدون NEXT_PUBLIC_ فقط server-side هستند
# ══════════════════════════════════════════════════════════════
```

**راستی‌آزمایی:**
```bash
cat .env.example
```
- بررسی وجود فایل و محتوای آن

**نکات مهم:**
- این فایل باید commit شود
- فایل .env واقعی را commit نکنید (باید در .gitignore باشد)
- تیم باید .env خود را بر اساس این مثال بسازند

---

## خلاصه فایل‌های تغییر و ایجاد

### فایل‌های جدید (۴ فایل):
1. `src/components/contact/ContactForm.tsx` - client component جداشده از contact page
2. `src/components/booking/BookingForm.tsx` - client component جداشده از booking page
3. `src/components/wiki/WikiList.tsx` - client component جداشده از wiki page
4. `.env.example` - مستندسازی environment variables

### فایل‌های تغییر (۹ فایل):
1. `src/app/contact/page.tsx` - تبدیل به server component wrapper + metadata
2. `src/app/booking/page.tsx` - تبدیل به server component wrapper + metadata
3. `src/app/wiki/page.tsx` - تبدیل به server component wrapper + metadata
4. `src/app/wiki/[slug]/page.tsx` - بهبود JSON-LD (TechArticle + BreadcrumbList)
5. `src/app/sitemap.ts` - اضافه کردن /booking
6. `next.config.js` - اضافه کردن images config و cache headers
7. `src/app/booking/success/layout.tsx` - اضافه کردن noindex metadata (ایجاد یا تغییر)
8. `src/app/booking/track/layout.tsx` - اضافه کردن noindex metadata (ایجاد یا تغییر)

**نکته:** layout.tsx‌ها ممکن است از قبل وجود داشته باشند، در این صورت فقط metadata اضافه می‌شود.

---

## ترتیب اولویت اجرا

**اولویت ۱ - تأثیر مستقیم روی SEO (۴ آیتم):**
1. آیتم ۴: بهبود JSON-LD مقالات (TechArticle + BreadcrumbList)
2. آیتم ۱: Contact metadata
3. آیتم ۲: Booking metadata
4. آیتم ۳: Wiki list metadata

**اولویت ۲ - بهینه‌سازی فنی (۲ آیتم):**
5. آیتم ۵: اضافه کردن /booking به sitemap
6. آیتم ۶: next.config.js optimization

**اولویت ۳ - Housekeeping (۲ آیتم):**
7. آیتم ۷: noindex برای صفحات داخلی
8. آیتم ۸: .env.example

**پیشنهاد اجرا:** می‌توان موازی کار کرد روی آیتم‌های ۱، ۲، ۳ (همه wrapper pattern هستند) و سپس آیتم ۴ و بقیه.

---

## نکات مهم برای جلوگیری از Breaking Changes

### ⚠️ Wrapper Pattern (آیتم‌های ۱، ۲، ۳):
- **هیچ تغییری در UI یا رفتار کاربری ندهید**
- همه state management، hooks، event handlers باید دقیقاً همان‌طور که هستند به client component منتقل شوند
- فقط metadata و import/export تغییر می‌کند
- بعد از هر تغییر، تست کامل صفحه را انجام دهید

### ⚠️ Hydration Errors:
- اگر خطای hydration دیدید، مطمئن شوید که:
  - 'use client' در client component وجود دارد
  - Suspense wrapper در client component است (برای booking)
  - هیچ server-only code در client component نیست

### ⚠️ RTL و Styling:
- همه صفحات RTL هستند و از YekanBakh font استفاده می‌کنند
- CSS custom properties (--color-*) باید کار کنند
- TailwindCSS classes نباید تغییر کنند

### ⚠️ API Calls:
- client components از `api.get/post` استفاده می‌کنند (از `@/lib/api`)
- server components از `fetch` با `INTERNAL_API_URL` استفاده می‌کنند
- revalidate timing را تغییر ندهید

### ⚠️ JSON-LD Schema:
- همه URLs باید absolute باشند (با https://)
- telephone در فرمت بین‌المللی: +98...
- از `business` config برای consistency استفاده کنید
- schema markup باید valid JSON باشد

### ⚠️ Production Build:
- بعد از تمام تغییرات، حتماً production build بگیرید:
  ```bash
  npm run build
  ```
- اگر build با خطا مواجه شد، مشکل را قبل از ادامه رفع کنید

---

## وابستگی‌ها

### آیتم‌های مستقل (می‌توان موازی اجرا کرد):
- آیتم ۱ (Contact)
- آیتم ۲ (Booking)  
- آیتم ۳ (Wiki)
- آیتم ۴ (Wiki article schema)
- آیتم ۵ (Sitemap)
- آیتم ۶ (next.config.js)
- آیتم ۷ (noindex)
- آیتم ۸ (.env.example)

**همه آیتم‌ها مستقل هستند و وابستگی به یکدیگر ندارند.**

---

## دستورات Build و Test

بر اساس `package.json`:

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
```

**Production Server:**
```bash
npm run start
```

**Linting:**
```bash
npm run lint
```

**نکته:** این پروژه test framework ندارد، پس verification باید manual انجام شود (مشاهده browser و source code).

---

## انتظارات بعد از اجرا

### SEO:
- همه صفحات اصلی دارای metadata کامل
- JSON-LD schemas برای LocalBusiness، Service، TechArticle، BreadcrumbList
- Sitemap کامل با همه URLs
- Robots.txt صحیح با disallow مناسب
- صفحات داخلی با noindex

### Performance:
- Image optimization با avif/webp
- Cache headers برای static assets
- Proper revalidation برای dynamic content

### Developer Experience:
- .env.example برای onboarding تیم جدید
- کد تمیز و maintainable با جداسازی client/server components
- بدون breaking changes در UI

---

## چک‌لیست نهایی

بعد از اجرای همه آیتم‌ها:

- [ ] همه صفحات اصلی metadata دارند (/, /contact, /booking, /wiki, /wiki/[slug], /remap, /repair-ecu)
- [ ] JSON-LD schemas در همه صفحات مناسب وجود دارند
- [ ] Sitemap.xml شامل همه URLs است (شامل /booking)
- [ ] صفحات داخلی noindex دارند (/booking/success, /booking/track)
- [ ] next.config.js دارای images و headers config است
- [ ] .env.example در root وجود دارد
- [ ] Build موفق است: `npm run build`
- [ ] هیچ breaking change در UI یا رفتار سایت وجود ندارد
- [ ] همه فرم‌ها کار می‌کنند (contact، booking)
- [ ] Navigation بین صفحات کار می‌کند

---

## مرحله بعدی (مرحله ۱۲ اصلی: تست نهایی)

بعد از اجرای موفقیت‌آمیز این برنامه، باید تست‌های زیر انجام شوند:

1. **Lighthouse Audit** (همه صفحات اصلی)
2. **Google Rich Results Test** (برای هر schema type)
3. **Sitemap Validation**
4. **Robots.txt Validation**
5. **Manual Testing** (همه فیچرهای سایت)

این تست‌ها در یک مرحله جداگانه پس از implementation انجام می‌شوند.
