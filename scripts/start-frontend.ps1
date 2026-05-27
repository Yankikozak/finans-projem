# Telefondan erişim: aynı Wi‑Fi'de http://BILGISAYAR-IP:3000
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location "$Root\frontend"

if (-not (Test-Path "node_modules")) {
    npm install
}

Write-Host "Site: http://localhost:3000" -ForegroundColor Green
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" } | Select-Object -First 1).IPAddress
Write-Host "Telefon (aynı Wi-Fi): http://${ip}:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Telefon acilmiyorsa ONCE (Yonetici): ..\scripts\open-firewall.ps1" -ForegroundColor Yellow
Write-Host "Windows: Ayarlar → Ag → Wi-Fi → Ozel ag profili: ACİK" -ForegroundColor Yellow
npm run dev
