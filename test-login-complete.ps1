# تست کامل لاگین

Write-Host "`n🧪 شروع تست کامل لاگین..." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════`n" -ForegroundColor Cyan

# 1. تست Backend Health
Write-Host "1️⃣ تست Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "   ✅ Backend: " -NoNewline -ForegroundColor Green
    Write-Host "$($health.status)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Backend در دسترس نیست!" -ForegroundColor Red
    Write-Host "   مطمئن شوید Backend اجرا است: npm run dev در پوشه backend`n" -ForegroundColor Yellow
    exit 1
}

# 2. تست لاگین
Write-Host "`n2️⃣ تست لاگین با speedster..." -ForegroundColor Yellow
$loginBody = @{
    identifier = "speedster"
    password = "Amir9900a"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -SessionVariable session

    Write-Host "   ✅ لاگین موفق!" -ForegroundColor Green
    Write-Host "   👤 Username: " -NoNewline
    Write-Host "$($response.user.identifier)" -ForegroundColor Cyan
    Write-Host "   🎭 Role: " -NoNewline
    Write-Host "$($response.user.role)" -ForegroundColor Cyan
    Write-Host "   📝 Name: " -NoNewline
    Write-Host "$($response.user.name)" -ForegroundColor Cyan
    
    # 3. تست دسترسی به /auth/me با Cookie
    Write-Host "`n3️⃣ تست دسترسی با Cookie..." -ForegroundColor Yellow
    $meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
        -Method Get `
        -WebSession $session
    
    Write-Host "   ✅ Cookie کار می‌کند!" -ForegroundColor Green
    Write-Host "   User: $($meResponse.user.identifier)" -ForegroundColor Cyan

} catch {
    Write-Host "   ❌ خطا در لاگین!" -ForegroundColor Red
    Write-Host "   پیام خطا: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "   جزئیات: $errorBody`n" -ForegroundColor Red
        } catch {
            Write-Host "   نمی‌توان جزئیات خطا را خواند`n" -ForegroundColor Red
        }
    }
    exit 1
}

# 4. خلاصه
Write-Host "`n═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ همه تست‌ها موفق بود!" -ForegroundColor Green
Write-Host "`n📌 اطلاعات لاگین:" -ForegroundColor Cyan
Write-Host "   Username: speedster" -ForegroundColor White
Write-Host "   Password: Amir9900a" -ForegroundColor White
Write-Host "`n🌐 آدرس صفحه لاگین:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001/auth" -ForegroundColor White
Write-Host "`n" -ForegroundColor Cyan
