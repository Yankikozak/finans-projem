# Telefondan Nexus Finance Açma

## 1. Güvenlik duvarı (Windows)

PowerShell'i **Yönetici olarak** açın:

```powershell
cd C:\Users\Yankı\Projects\nexus-finance
.\scripts\open-firewall.ps1
```

Bu script 3000 ve 8000 portlarını açar.

## 2. Özel ağ profili

1. **Ayarlar** → **Ağ ve İnternet** → **Wi‑Fi**
2. Bağlı olduğunuz ağ → **Özel ağ** (Etkin olmalı)

Ev ağında "Genel" profil telefon erişimini engelleyebilir.

## 3. Sunucuları başlatın

```powershell
.\scripts\start-backend.ps1
.\scripts\start-frontend.ps1
```

## 4. Telefonda açın

Bilgisayar IP'si script çıktısında yazar, örn:

`http://192.168.1.104:3000`

**localhost telefonda çalışmaz** — bilgisayarın IP'sini kullanın.

## 3000 vs 8000

| Port | Ne |
|------|-----|
| 3000 | Web sitesi (bunu telefonda açın) |
| 8000 | API (JSON; `{"status":"ok"}` = çalışıyor demek) |
