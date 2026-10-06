# 🚨 اقدامات امنیتی فوری

## وضعیت فعلی
رمز عبور ادمین در فایل‌های GitHub قابل مشاهده بوده است.

## ✅ انجام شده
- فایل‌های امنیتی حذف شدند:
  - `backend/create-and-test-admin.js`
  - `test-login-complete.ps1`
  - `test-article.js`
  - `test-atlas-connection.js`
  - `test-landing-page.json`
  - `encode-password.js`
  - `list-admins.js`
  - `publish-*.js`, `publish-*.ps1`
  - `quick-publish.js`, `quick-publish.ps1`

## ⚠️ هشدار مهم
**این فایل‌ها توی Git History هنوز موجودند!** حذف فایل فقط از commit جدید حذف می‌کنه.

## 🔴 اقدامات فوری (باید الان انجام بشه)

### مرحله 1: Private کردن Repository (اولویت اول)
1. برو به: https://github.com/YOUR-USERNAME/YOUR-REPO/settings
2. پایین صفحه، بخش **Danger Zone**
3. کلیک **Change visibility** → **Make private**
4. تایپ کن نام repository رو و تایید کن

### مرحله 2: تغییر رمز عبور ادمین روی VPS
```bash
# SSH به VPS
ssh root@91.107.157.82

# برو به پوشه backend
cd ~/Radif-Ecu/backend

# Pull آخرین تغییرات
git pull

# نصب dependencies (اگه نیاز بود)
npm install

# اجرای اسکریپت تغییر رمز
node scripts/changeAdminPassword.js
```

**در اسکریپت:**
- Username: `speedster` (یا Enter بزن)
- رمز جدید: **یه رمز قوی انتخاب کن** (حداقل 8 کاراکتر، ترکیبی از حروف، اعداد، علامت)
- تایید رمز

**مثال رمز قوی:** `Ecu@Repair2026!Tehran`

### مرحله 3: Restart Backend
```bash
# Restart PM2
pm2 restart radif-backend

# چک کن که درست کار می‌کنه
pm2 logs radif-backend
```

### مرحله 4: تست لاگین
برو به: http://91.107.157.82:5000/api/auth/login

با رمز جدید تست کن.

---

## 🔧 گزینه 2: پاک کردن Git History (اگه می‌خوای repo رو public نگه داری)

**نکته:** این کار خطرناکه و باید دقت کامل داشته باشی!

### استفاده از BFG Repo-Cleaner

```bash
# Download BFG
# از https://rtyley.github.io/bfg-repo-cleaner/

# Clone یه mirror
git clone --mirror https://github.com/YOUR-USERNAME/YOUR-REPO.git

# پاک کردن فایل‌های خاص
java -jar bfg.jar --delete-files create-and-test-admin.js YOUR-REPO.git
java -jar bfg.jar --delete-files test-login-complete.ps1 YOUR-REPO.git
java -jar bfg.jar --delete-files "test-*.js" YOUR-REPO.git
java -jar bfg.jar --delete-files "publish-*.js" YOUR-REPO.git

# پاک کردن متن‌های خاص (رمز عبور)
java -jar bfg.jar --replace-text passwords.txt YOUR-REPO.git

# Push تغییرات
cd YOUR-REPO.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**فایل `passwords.txt`:**
```
[رمزهای قدیمی - از دیتابیس پاک شده]
```

---

## 🆕 گزینه 3: Repository جدید (ساده‌ترین)

```bash
# 1. Create یه repo جدید PRIVATE در GitHub

# 2. Clone کن repo فعلی (بدون history)
git clone --depth 1 https://github.com/OLD-REPO.git radif-ecu-new
cd radif-ecu-new

# 3. پاک کردن old remote
git remote remove origin

# 4. اضافه کردن new remote
git remote add origin https://github.com/YOUR-USERNAME/NEW-REPO.git

# 5. Push
git push -u origin main
```

---

## 📋 Checklist

- [ ] Repository رو private کردم
- [ ] رمز ادمین روی VPS رو تغییر دادم
- [ ] Backend رو restart کردم
- [ ] با رمز جدید تست کردم
- [ ] `.env` files رو چک کردم که توی git نباشن
- [ ] فایل‌های جدید credential ندارن

---

## 🔐 نکات امنیتی برای آینده

1. **هیچوقت credentials رو commit نکن**
   - استفاده از `.env` برای secrets
   - `.env` رو add کن به `.gitignore`
   - فقط `.env.example` رو commit کن

2. **استفاده از Environment Variables**
   ```bash
   # On VPS
   export ADMIN_USERNAME=speedster
   export ADMIN_PASSWORD=your-secure-password
   ```

3. **GitHub Secrets برای CI/CD**
   - Settings → Secrets and variables → Actions
   - اضافه کن: `MONGODB_URI`, `JWT_SECRET`, etc.

4. **2FA برای GitHub**
   - Settings → Password and authentication → Enable 2FA

5. **Regular Password Rotation**
   - هر 3-6 ماه رمزها رو عوض کن

---

## ❓ سوالات متداول

**Q: اگه رمز رو عوض کنم، سایت down میشه؟**
A: نه! فقط باید با رمز جدید login کنی. Backend restart نمیشه.

**Q: Vercel هم باید کاری بکنم؟**
A: نه، Vercel فقط frontend هست. Backend روی VPS هست.

**Q: Git history رو چطوری چک کنم؟**
A: 
```bash
git log --all --full-history -- "**/create-and-test-admin.js"
```

---

## 📞 در صورت مشکل

اگه مشکلی پیش اومد یا سوالی داشتی، بگو تا کمک کنم.

**این فایل رو پاک کن بعد از اینکه همه کارها رو انجام دادی.**
