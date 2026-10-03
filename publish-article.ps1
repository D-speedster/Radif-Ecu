# اسکریپت درج مقاله در دیتابیس
# با پشتیبانی کامل از UTF-8 برای فارسی

# تنظیم encoding به UTF-8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$apiUrl = "http://localhost:5000/api/articles"
$articlePath = ".\.agents\tasks\engine-knock-article.json"

# خواندن فایل JSON با encoding صحیح
$articleJson = Get-Content -Path $articlePath -Raw -Encoding UTF8

# ارسال درخواست
$headers = @{
    "Content-Type" = "application/json; charset=utf-8"
    # اگر نیاز به احراز هویت دارید، Authorization را اضافه کنید
    # "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

try {
    Write-Host "در حال ارسال مقاله به API..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($articleJson)) -Headers $headers -ContentType "application/json; charset=utf-8"
    
    Write-Host "✅ مقاله با موفقیت منتشر شد!" -ForegroundColor Green
    Write-Host "URL مقاله: http://localhost:3000/wiki/rafeh-nak-mashin" -ForegroundColor Cyan
    Write-Host "ID مقاله: $($response._id)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ خطا در انتشار مقاله:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "راهنمایی:" -ForegroundColor Yellow
    Write-Host "1. مطمئن شوید backend در حال اجراست (npm start در پوشه backend)" -ForegroundColor White
    Write-Host "2. اگر نیاز به احراز هویت دارید، Authorization Token را اضافه کنید" -ForegroundColor White
    Write-Host ""
    Write-Host "برای تست backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
}
