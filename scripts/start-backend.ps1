# Nexus Finance — Backend başlat (SQLite, Docker gerekmez)
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location "$Root\backend"

if (-not (Test-Path ".venv")) {
    python -m venv .venv
    .\.venv\Scripts\pip install fastapi "uvicorn[standard]" sqlalchemy aiosqlite pydantic pydantic-settings python-dotenv rapidfuzz httpx yfinance redis python-jose passlib bcrypt email-validator authlib openai orjson fredapi
}

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Write-Host "API: http://localhost:8000/api/docs" -ForegroundColor Green
.\.venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
