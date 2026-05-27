# Windows Güvenlik Duvarı — Nexus Finance (3000 + 8000)
# Yönetici olarak çalıştırın: Sağ tık → "Yönetici olarak çalıştır"

$ErrorActionPreference = "Stop"

if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Bu script YÖNETİCİ olarak çalıştırılmalı." -ForegroundColor Red
    Write-Host "PowerShell'i sağ tık → Yönetici olarak acin, sonra tekrar deneyin."
    exit 1
}

$rules = @(
    @{ Name = "Nexus Finance Web (3000)"; Port = 3000 },
    @{ Name = "Nexus Finance API (8000)"; Port = 8000 }
)

foreach ($r in $rules) {
    $existing = Get-NetFirewallRule -DisplayName $r.Name -ErrorAction SilentlyContinue
    if ($existing) {
        Remove-NetFirewallRule -DisplayName $r.Name
    }
    New-NetFirewallRule -DisplayName $r.Name `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $r.Port `
        -Profile Any `
        | Out-Null
    Write-Host "[OK] Port $($r.Port) acildi — $($r.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Ozel ag profili (Wi-Fi) icin dosya paylasimi acik olmali:" -ForegroundColor Cyan
Write-Host "Ayarlar → Ag ve Internet → Wi-Fi → Ozel ag profili: ACİK"
Write-Host ""
$ip = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown"
} | Select-Object -First 1 -ExpandProperty IPAddress

Write-Host "Telefondan site: http://${ip}:3000" -ForegroundColor Yellow
