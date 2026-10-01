<#
.SYNOPSIS
  Prepare le ZIP pour deploiement Hostinger (Option A hPanel).
  A executer depuis la RACINE du projet dans PowerShell.
#>

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployDir = Join-Path $root "deploy-package"
$zipPath = Join-Path $root "hertz-hostinger-deploy.zip"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Hertz Digital - Preparation ZIP Hostinger " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Nettoyage ancien dossier..." -ForegroundColor Yellow
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
if (Test-Path $zipPath)    { Remove-Item -Force $zipPath }
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

Write-Host "[2/5] Copie du build (dist/)..." -ForegroundColor Yellow
Copy-Item -Recurse -Path (Join-Path $root "backend\dist") -Destination (Join-Path $deployDir "dist")

Write-Host "[3/5] Copie package.json + package-lock.json..." -ForegroundColor Yellow
Copy-Item -Path (Join-Path $root "backend\package.json")      -Destination $deployDir
Copy-Item -Path (Join-Path $root "backend\package-lock.json") -Destination $deployDir

Write-Host "[4/5] Copie schema Prisma + ecosystem + .env..." -ForegroundColor Yellow
$prismaDir = Join-Path $deployDir "dist\prisma"
if (-not (Test-Path $prismaDir)) { New-Item -ItemType Directory -Force -Path $prismaDir | Out-Null }
Copy-Item -Path (Join-Path $root "backend\src\prisma\schema.prisma") -Destination $prismaDir

Copy-Item -Path (Join-Path $root "backend\ecosystem.config.js") -Destination $deployDir -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $root "backend\.env")                -Destination $deployDir -ErrorAction SilentlyContinue

Write-Host "[5/5] Generation de hertz-hostinger-deploy.zip..." -ForegroundColor Yellow
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "TERMINE !" -ForegroundColor Green
Write-Host ""
Write-Host "Fichier ZIP cree : $zipPath" -ForegroundColor Cyan
$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "Taille : $zipSize Mo"
Write-Host ""
Write-Host "Prochaine etape :" -ForegroundColor Yellow
Write-Host "  1. Ouvrez https://hpanel.hostinger.com/"
Write-Host "  2. Votre hebergement > Fichiers > Gestionnaire de fichiers"
Write-Host "  3. Uploader le ZIP dans public_html/"
Write-Host "  4. Decompresser puis creer App Node.js"
Write-Host ""

try { Invoke-Item (Split-Path -Parent $zipPath) } catch {}
