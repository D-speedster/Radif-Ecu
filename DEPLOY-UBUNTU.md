# راهنمای Deploy Backend روی Ubuntu VPS

این راهنما مراحل کامل Deploy کردن Backend پروژه Radif-Ecu روی Ubuntu VPS را شرح می‌دهد.

---

## پیش‌نیازها

قبل از شروع، مطمئن شوید که:
- ✅ Ubuntu 20.04 یا بالاتر
- ✅ دسترسی SSH به VPS
- ✅ User با sudo privileges

---

## مرحله 1: نصب Node.js و npm

```bash
# به‌روزرسانی پکیج‌ها
sudo apt update
sudo apt upgrade -y

# نصب Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی نسخه
node --version  # باید v20.x.x نمایش دهد
npm --version   # باید v10.x.x نمایش دهد
```

---

## مرحله 2: نصب PM2 (Process Manager)

```bash
# نصب PM2 به صورت global
sudo npm install -g pm2

# بررسی نصب
pm2 --version
```

---

## مرحله 3: آپلود کد Backend

### روش 1: استفاده از Git (توصیه می‌شود)

```bash
# نصب Git
sudo apt install git -y

# ایجاد دایرکتوری برای پروژه
sudo mkdir -p /var/www/radif-ecu
sudo chown -R $USER:$USER /var/www/radif-ecu

# Clone repository
cd /var/www/radif-ecu
git clone <YOUR_REPO_URL> .

# اگر repository خصوصی است، از SSH key یا Personal Access Token استفاده کنید
```

### روش 2: آپلود دستی با SCP

```bash
# از کامپیوتر محلی:
scp -r /path/to/ECU/backend user@YOUR_VPS_IP:/var/www/radif-ecu/
```

---

## مرحله 4: نصب Dependencies

```bash
cd /var/www/radif-ecu/backend

# نصب فقط production dependencies
npm ci --only=production

# بررسی نصب موفق
npm list
```

---

## مرحله 5: تنظیم Environment Variables

```bash
# ایجاد فایل .env از template
cd /var/www/radif-ecu/backend
cp .env.production.example .env

# ویرایش فایل .env
nano .env
```

**مقادیر مهم که باید تنظیم کنید:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/radif?retryWrites=true&w=majority
JWT_SECRET=<your-strong-random-secret-min-32-chars>
COOKIE_SECURE=true
CLIENT_URL=https://radif-ecu.ir
NODE_ENV=production
TRUST_PROXY=1
ALLOW_REGISTRATION=false
```

**⚠️ نکات مهم:**
- `MONGO_URI`: از MongoDB Atlas دریافت کنید
- `JWT_SECRET`: با دستور زیر تولید کنید:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `COOKIE_SECURE=true`: فقط اگر HTTPS دارید
- `CLIENT_URL`: دقیقاً مطابق با domain Frontend

---

## مرحله 6: تنظیم MongoDB Atlas Network Access

1. وارد MongoDB Atlas شوید
2. به بخش **Network Access** بروید
3. روی **Add IP Address** کلیک کنید
4. IP خروجی VPS خود را اضافه کنید:
   ```bash
   # برای یافتن IP خروجی VPS:
   curl ifconfig.me
   ```
5. یا برای تست، **Allow Access from Anywhere** را فعال کنید (توصیه نمی‌شود)

---

## مرحله 7: تست اجرای Backend

```bash
cd /var/www/radif-ecu/backend

# تست اجرای مستقیم
node server.js

# اگر پیام زیر را دیدید، موفق است:
# ✅ MongoDB Connected: ...
# 🚀 Server running in production mode on port 5000
```

اگر خطا داشتید:
- بررسی کنید `MONGO_URI` صحیح است
- بررسی کنید IP VPS در MongoDB Whitelist است
- بررسی کنید Port 5000 باز است

**توقف تست:** `Ctrl + C`

---

## مرحله 8: اجرای با PM2

```bash
cd /var/www/radif-ecu/backend

# شروع Backend با PM2
pm2 start server.js --name radif-backend

# بررسی وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs radif-backend

# توقف لاگ: Ctrl + C
```

---

## مرحله 9: تنظیم Auto-Start

```bash
# ذخیره لیست فعلی PM2
pm2 save

# تنظیم startup script
pm2 startup

# دستور خروجی را کپی و اجرا کنید
# مثلاً:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u USER --hp /home/USER

# بررسی
sudo systemctl status pm2-USER
```

---

## مرحله 10: تنظیم Firewall

```bash
# نصب UFW (اگر نصب نیست)
sudo apt install ufw -y

# اجازه SSH (مهم!)
sudo ufw allow 22/tcp

# اجازه Port 5000 برای Backend
sudo ufw allow 5000/tcp

# فعال‌سازی Firewall
sudo ufw enable

# بررسی وضعیت
sudo ufw status
```

**⚠️ توجه:** اگر Backend را پشت Nginx قرار می‌دهید، Port 5000 را فقط برای localhost باز کنید:
```bash
sudo ufw delete allow 5000/tcp
# Port 5000 فقط از localhost قابل دسترسی است
```

---

## مرحله 11: تست API از خارج

```bash
# از کامپیوتر محلی:
curl http://YOUR_VPS_IP:5000/api/health

# باید پاسخ زیر را دریافت کنید:
# {"success":true,"status":"online","timestamp":"..."}
```

---

## مرحله 12: ایجاد Admin User

```bash
cd /var/www/radif-ecu/backend

# اجرای script ایجاد Admin
node scripts/createAdmin.js

# مقادیر خواسته شده را وارد کنید:
# - نام
# - شماره موبایل / ایمیل
# - رمز عبور (حداقل 8 کاراکتر)
```

---

## دستورات مفید PM2

```bash
# مشاهده لیست processها
pm2 list

# مشاهده لاگ‌ها
pm2 logs radif-backend
pm2 logs radif-backend --lines 100

# Restart
pm2 restart radif-backend

# Stop
pm2 stop radif-backend

# Start (بعد از stop)
pm2 start radif-backend

# Delete process
pm2 delete radif-backend

# Monitoring
pm2 monit

# اطلاعات کامل
pm2 show radif-backend

# پاک کردن لاگ‌ها
pm2 flush
```

---

## بروزرسانی Backend

```bash
# توقف Backend
pm2 stop radif-backend

# Pull تغییرات جدید
cd /var/www/radif-ecu/backend
git pull origin main

# نصب dependencies جدید (در صورت وجود)
npm ci --only=production

# شروع مجدد
pm2 restart radif-backend

# بررسی لاگ‌ها
pm2 logs radif-backend --lines 50
```

---

## نصب Nginx (اختیاری اما توصیه می‌شود)

### چرا Nginx؟
- SSL/TLS (HTTPS)
- Load Balancing
- Caching
- Reverse Proxy بهتر

### نصب و تنظیم:

```bash
# نصب Nginx
sudo apt install nginx -y

# ایجاد فایل تنظیمات
sudo nano /etc/nginx/sites-available/radif-backend
```

**محتوای فایل:**

```nginx
server {
    listen 80;
    server_name api.radif-ecu.ir;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# فعال‌سازی site
sudo ln -s /etc/nginx/sites-available/radif-backend /etc/nginx/sites-enabled/

# تست تنظیمات
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# فعال‌سازی auto-start
sudo systemctl enable nginx
```

### نصب SSL با Let's Encrypt:

```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx -y

# دریافت SSL Certificate
sudo certbot --nginx -d api.radif-ecu.ir

# Certbot به صورت خودکار Nginx را تنظیم می‌کند
# و Certificate را هر 90 روز تمدید می‌کند

# بررسی Auto-renewal
sudo systemctl status certbot.timer
```

**بعد از نصب SSL:**
- در `backend/.env`: `COOKIE_SECURE=true`
- در `Vercel`: `BACKEND_ORIGIN=https://api.radif-ecu.ir`
- Backend را restart کنید: `pm2 restart radif-backend`

---

## تنظیمات DNS (در صورت استفاده از Subdomain)

اگر می‌خواهید از `api.radif-ecu.ir` استفاده کنید:

1. وارد پنل DNS Provider شوید (مثلاً Cloudflare، Namecheap)
2. یک Record جدید اضافه کنید:
   - **Type**: A
   - **Name**: api
   - **Value**: IP VPS شما
   - **TTL**: Auto یا 3600

3. منتظر Propagate شدن DNS باشید (5-30 دقیقه)

4. تست:
   ```bash
   ping api.radif-ecu.ir
   ```

---

## عیب‌یابی (Troubleshooting)

### Backend شروع نمی‌شود:

```bash
# بررسی لاگ‌های PM2
pm2 logs radif-backend --lines 100

# خطاهای رایج:
# - MongoDB Connection: بررسی MONGO_URI و Network Access
# - Port in use: pm2 delete radif-backend && pm2 start server.js --name radif-backend
# - Module not found: npm ci --only=production
```

### نمی‌توانم از خارج به Backend متصل شوم:

```bash
# بررسی Backend در حال اجرا است
pm2 status

# بررسی Firewall
sudo ufw status

# بررسی Port باز است
sudo netstat -tulpn | grep 5000

# تست از localhost
curl http://localhost:5000/api/health

# تست از خارج
curl http://YOUR_VPS_IP:5000/api/health
```

### Cookie کار نمی‌کند:

- بررسی `COOKIE_SECURE` مطابق با HTTPS/HTTP است
- بررسی `CLIENT_URL` دقیقاً مطابق با Frontend است
- بررسی `TRUST_PROXY` صحیح است
- بررسی CORS مجاز است

---

## Monitoring و Logs

```bash
# CPU و Memory usage
pm2 monit

# دیسک
df -h

# Network
sudo iftop

# Logs Backend
pm2 logs radif-backend

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u pm2-USER -f
```

---

## Backup

```bash
# Backup .env
cp /var/www/radif-ecu/backend/.env ~/backend-env-backup.txt

# ⚠️ این فایل حاوی Secretهای حساس است
# در جای امن نگهداری کنید
```

---

## Rollback

اگر مشکلی پیش آمد و نیاز به برگشت دارید:

```bash
# توقف Backend
pm2 stop radif-backend

# برگشت به commit قبلی
cd /var/www/radif-ecu/backend
git log --oneline  # پیدا کردن commit hash
git checkout <PREVIOUS_COMMIT_HASH>

# نصب مجدد dependencies
npm ci --only=production

# شروع مجدد
pm2 restart radif-backend
```

---

## چک‌لیست نهایی

- [ ] Node.js نصب است (`node --version`)
- [ ] PM2 نصب است (`pm2 --version`)
- [ ] Backend code در `/var/www/radif-ecu/backend`
- [ ] Dependencies نصب شده (`npm ci --only=production`)
- [ ] فایل `.env` تنظیم شده
- [ ] MongoDB Atlas Network Access تنظیم شده
- [ ] Backend با PM2 اجرا می‌شود (`pm2 status`)
- [ ] Auto-start تنظیم شده (`pm2 save` و `pm2 startup`)
- [ ] Firewall تنظیم شده (`sudo ufw status`)
- [ ] `/api/health` پاسخ می‌دهد
- [ ] Admin User ایجاد شده
- [ ] SSL نصب شده (در صورت استفاده از Domain)

---

## پشتیبانی

اگر مشکلی داشتید:
1. لاگ‌های PM2 را بررسی کنید
2. مستندات MongoDB Atlas را مطالعه کنید
3. تنظیمات Firewall را چک کنید
4. Environment Variables را دوباره بررسی کنید

---

**تبریک! Backend شما آماده است! 🎉**

حالا باید تنظیمات Vercel را انجام دهید تا Frontend به VPS متصل شود.
