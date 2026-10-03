# راه جایگزین: استفاده از curl

$articlePath = ".\.agents\tasks\engine-knock-article.json"
$apiUrl = "http://localhost:5000/api/articles"

Write-Host "در حال ارسال مقاله به API با curl..." -ForegroundColor Yellow

# استفاده از curl که encoding را بهتر مدیریت می‌کند
$curlCommand = "curl -X POST $apiUrl -H `"Content-Type: application/json; charset=utf-8`" --data-binary `"@$articlePath`""

Write-Host "دستور اجرا شده:" -ForegroundColor Cyan
Write-Host $curlCommand -ForegroundColor Gray
Write-Host ""

# اجرای curl
Invoke-Expression $curlCommand

Write-Host ""
Write-Host "اگر موفق بود، مقاله را اینجا ببینید:" -ForegroundColor Green
Write-Host "http://localhost:3000/wiki/rafeh-nak-mashin" -ForegroundColor Cyan
