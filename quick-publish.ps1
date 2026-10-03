# اسکریپت سریع: ساخت ادمین و انتشار مقاله

param(
    [string]$Email = "admin@radif-ecu.ir",
    [string]$Password = "Admin123!@#"
)

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   انتشار مقاله 'رفع ناک ماشین'      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. ساخت ادمین (اگر وجود نداشته باشد)
Write-Host "🔧 مرحله 1: بررسی/ساخت ادمین..." -ForegroundColor Yellow
cd backend
$env:ADMIN_IDENTIFIER = $Email
$env:ADMIN_PASSWORD = $Password
node scripts/createAdmin.js
cd ..

Write-Host ""

# 2. انتشار مقاله
Write-Host "📝 مرحله 2: انتشار مقاله..." -ForegroundColor Yellow

$articleJson = Get-Content -Path ".\.agents\tasks\engine-knock-article.json" -Raw -Encoding UTF8

# ابتدا login کنیم
$loginData = @{
    email = $Email
    password = $Password
} | ConvertTo-Json -Compress

try {
    Write-Host "🔐 ورود به سیستم..." -ForegroundColor Gray
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json; charset=utf-8"
    
    $token = $loginResponse.token
    Write-Host "✅ ورود موفق!`n" -ForegroundColor Green
    
    # حالا مقاله را منتشر کنیم
    Write-Host "📤 ارسال مقاله..." -ForegroundColor Gray
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json; charset=utf-8"
    }
    
    $articleResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/articles" `
        -Method Post `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($articleJson)) `
        -Headers $headers `
        -ContentType "application/json; charset=utf-8"
    
    Write-Host ""
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ مقاله با موفقیت منتشر شد!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 عنوان: $($articleResponse.title)" -ForegroundColor Cyan
    Write-Host "🆔 ID: $($articleResponse._id)" -ForegroundColor Cyan
    Write-Host "🔗 URL: http://localhost:3000/wiki/$($articleResponse.slug)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 حالا می‌توانید مقاله را در مرورگر مشاهده کنید!" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ خطا: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Yellow
    Write-Host "   1. Backend is running (cd backend && npm start)" -ForegroundColor White
    Write-Host "   2. Email and password are correct" -ForegroundColor White
}
