# راهنمای Deploy Frontend روی Vercel

این راهنما مراحل کامل Deploy کردن Frontend پروژه Radif-Ecu روی Vercel را با اتصال به Backend روی VPS شرح می‌دهد.

---

## پیش‌نیازها

- ✅ اکانت Vercel (رایگان کافی است)
- ✅ Repository پروژه روی GitHub/GitLab/Bitbucket
- ✅ Backend روی Ubuntu VPS اجرا شده و در دسترس است

---

## مرحله 1: ایجاد پروژه جدید در Vercel

### روش 1: از طریق Dashboard

1. وارد [https://vercel.com](https://vercel.com) شوید
2. روی **Add New Project** کلیک کنید
3. Repository خود را انتخاب کنید
4. **Framework Preset**: Next.js (باید خودکار تشخیص دهد)
5. **Root Directory**: `.` (پیش‌فرض)
6. **Build Command**: `npm run build` (پیش‌فرض)
7. **Output Directory**: `.next` (پیش‌فرض)

**⚠️ هنوز Deploy نکنید!** ابتدا Environment Variables را تنظیم کنید.

### روش 2: از طریق Vercel CLI

```bash
# نصب Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (از root پروژه)
vercel
```

---

## مرحله 2: تنظیم Environment Variables

در Vercel Dashboard:
1. به **Project Settings** بروید
2. تب **Environment Variables** را باز کنید
3. متغیرهای زیر را اضافه کنید:

### متغیرهای عمومی (Public)

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://radif-ecu.ir` | Production |
| `NEXT_PUBLIC_API_URL` | `/api` | Production |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` (اختیاری) | Production |

### متغیرهای خصوصی (Server-Side Only)

| Key | Value | Environment |
|-----|-------|-------------|
| `BACKEND_ORIGIN` | `http://YOUR_VPS_IP:5000` یا `https://api.radif-ecu.ir` | Production |
| `INTERNAL_API_URL` | `http://YOUR_VPS_IP:5000/api` یا `https://api.radif-ecu.ir/api` | Production |

**⚠️ نکات بسیار مهم:**

1. **NEXT_PUBLIC_API_URL باید `/api` باشد** (نه URL کامل)
2. **BACKEND_ORIGIN و INTERNAL_API_URL** را با IP/Domain واقعی VPS خود جایگزین کنید
3. اگر از Subdomain استفاده می‌کنید: `https://api.radif-ecu.ir`
4. اگر از IP مستقیم استفاده می‌کنید: `http://YOUR_VPS_IP:5000`
5. اگر SSL روی VPS دارید، از `https` استفاده کنید

### متغیرهای Development (اختیاری)

برای Preview Deployments:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://radif-ecu-git-<branch>-<username>.vercel.app` | Preview |
| `NEXT_PUBLIC_API_URL` | `/api` | Preview |
| `BACKEND_ORIGIN` | `http://YOUR_VPS_IP:5000` | Preview |
| `INTERNAL_API_URL` | `http://YOUR_VPS_IP:5000/api` | Preview |

---

## مرحله 3: تنظیم Custom Domain

### افزودن Domain اصلی

1. در Vercel Dashboard، به **Settings → Domains** بروید
2. روی **Add Domain** کلیک کنید
3. Domain خود را وارد کنید: `radif-ecu.ir`
4. Vercel دستورالعمل‌های DNS را نمایش می‌دهد

### تنظیم DNS

در پنل DNS Provider خود (مثلاً Cloudflare، Namecheap):

**روش 1: استفاده از A Record**
```
Type: A
Name: @
Value: 76.76.21.21  (IP Vercel)
```

**روش 2: استفاده از CNAME**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**برای www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**⚠️ توجه:** IP های Vercel ممکن است تغییر کنند، از Dashboard خود استفاده کنید.

### Redirect www به non-www (یا برعکس)

در Vercel Dashboard → Domains:
- `radif-ecu.ir` → Primary
- `www.radif-ecu.ir` → Redirect to `radif-ecu.ir`

---

## مرحله 4: Deploy

### از Dashboard:
1. روی **Deploy** کلیک کنید
2. منتظر بمانید تا Build تمام شود (2-5 دقیقه)
3. اگر خطا داشت، لاگ‌ها را بررسی کنید

### از CLI:
```bash
# Production deploy
vercel --prod

# Preview deploy
vercel
```

---

## مرحله 5: تست اتصال

### تست Browser Developer Tools:

1. سایت را باز کنید: `https://radif-ecu.ir`
2. Developer Tools را باز کنید (F12)
3. به تب **Network** بروید
4. یک عملیات API انجام دهید (مثلاً فرم تماس)
5. بررسی کنید:
   - ✅ Request URL باید `/api/...` باشد (نه IP VPS)
   - ✅ Domain باید `radif-ecu.ir` باشد
   - ✅ Status Code باید 200 باشد
   - ✅ Cookie ها Set شده باشند

### تست Curl:

```bash
# تست از مرورگر
curl https://radif-ecu.ir/api/health

# باید پاسخ زیر را دریافت کنید:
# {"success":true,"status":"online","timestamp":"..."}
```

---

## مرحله 6: تست قابلیت‌های اصلی

- [ ] صفحه اصلی لود می‌شود
- [ ] مقالات نمایش داده می‌شوند
- [ ] فرم تماس کار می‌کند
- [ ] رزرو نوبت کار می‌کند
- [ ] لاگین ادمین کار می‌کند
- [ ] Cookie ها Set می‌شوند
- [ ] پنل ادمین در دسترس است

---

## مرحله 7: تنظیمات امنیتی Vercel

### Headers امنیتی (اختیاری)

فایل `vercel.json` در root پروژه ایجاد کنید:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## Redeploy بعد از تغییرات

### خودکار (با Git):
```bash
git add .
git commit -m "Update backend connection"
git push origin main

# Vercel به صورت خودکار build و deploy می‌کند
```

### دستی (با CLI):
```bash
vercel --prod
```

---

## بررسی لاگ‌های Build

1. در Vercel Dashboard، به **Deployments** بروید
2. روی آخرین Deployment کلیک کنید
3. تب **Build Logs** را باز کنید
4. خطاها را بررسی کنید

خطاهای رایج:
- **Module not found**: `npm install` اجرا نشده
- **Environment variable undefined**: متغیرها را در Dashboard تنظیم کنید
- **Build timeout**: پروژه خیلی بزرگ است یا Dependencies زیاد

---

## Rollback

اگر Deploy جدید مشکل دارد:

1. در Vercel Dashboard، به **Deployments** بروید
2. Deploy قبلی را پیدا کنید
3. روی **Promote to Production** کلیک کنید

---

## Monitoring

### Analytics

Vercel به صورت خودکار Analytics ارائه می‌دهد:
- Page Views
- Visitors
- Top Pages
- Countries
- Devices

در Dashboard → **Analytics** قابل مشاهده است.

### Logs

برای مشاهده لاگ‌های Runtime:
1. Dashboard → **Functions**
2. لاگ‌های هر Function را مشاهده کنید

---

## تنظیمات پیشرفته

### Preview Deployments

هر Push به branch غیر از `main` یک Preview Deployment ایجاد می‌کند:
- `https://radif-ecu-git-feature-branch-username.vercel.app`

برای غیرفعال کردن:
- Dashboard → Settings → Git → Ignored Build Step
- Custom Script:
  ```bash
  if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then exit 0; fi
  ```

### Build Cache

Vercel به صورت خودکار dependencies را cache می‌کند.

برای پاک کردن cache:
- Dashboard → Settings → General → Clear Cache

---

## Performance Optimization

### Image Optimization

Next.js Image component به صورت خودکار تصاویر را optimize می‌کند.

### Edge Functions

اگر نیاز به Caching بیشتر دارید:
- از `Edge Middleware` استفاده کنید
- یا از CDN خارجی (Cloudflare)

---

## عیب‌یابی

### سایت لود نمی‌شود:

```bash
# بررسی DNS
nslookup radif-ecu.ir

# بررسی SSL
curl -I https://radif-ecu.ir

# بررسی Deployment
vercel ls
```

### API کار نمی‌کند:

1. بررسی Environment Variables در Vercel
2. بررسی Backend در VPS در حال اجرا است
3. بررسی `BACKEND_ORIGIN` صحیح است
4. بررسی CORS در Backend

### Cookie ها Set نمی‌شوند:

- بررسی `COOKIE_SECURE` در Backend
- بررسی `sameSite` درست است
- بررسی Domain مطابقت دارد

---

## چک‌لیست نهایی

- [ ] Vercel Project ایجاد شده
- [ ] Environment Variables تنظیم شده
- [ ] `NEXT_PUBLIC_API_URL=/api`
- [ ] `BACKEND_ORIGIN` صحیح است
- [ ] `INTERNAL_API_URL` صحیح است
- [ ] Custom Domain اضافه شده
- [ ] DNS تنظیم شده
- [ ] SSL فعال است (HTTPS)
- [ ] Deploy موفق بوده
- [ ] تست API از Browser موفق است
- [ ] Cookie ها کار می‌کنند
- [ ] تمام قابلیت‌ها تست شده‌اند

---

## هزینه‌ها

**Vercel Free Plan:**
- 100 GB Bandwidth/month
- Unlimited Deployments
- Automatic HTTPS
- Global CDN

برای پروژه Radif-Ecu، Free Plan کافی است.

---

## پشتیبانی

**مستندات Vercel:**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

**مشکل داشتید؟**
1. Build Logs را بررسی کنید
2. Environment Variables را دوباره چک کنید
3. Backend VPS در حال اجرا است؟
4. CORS درست تنظیم شده؟

---

**تبریک! Frontend شما روی Vercel Deploy شد! 🚀**

حالا باید تست کامل انجام دهید که همه چیز کار می‌کند.
