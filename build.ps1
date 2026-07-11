$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$css  = [System.IO.File]::ReadAllText((Join-Path $dir 'style.css'))
$js   = [System.IO.File]::ReadAllText((Join-Path $dir 'game.js'))
$body = [System.IO.File]::ReadAllText((Join-Path $dir 'body.html'))

function Escape-NonAscii([string]$s) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $s.ToCharArray()) {
    $code = [int]$ch
    if ($code -gt 127) { [void]$sb.Append('\u' + $code.ToString('x4')) } else { [void]$sb.Append($ch) }
  }
  return $sb.ToString()
}
$js = Escape-NonAscii $js

# ---- sprite baking: every PNG in sprites/ becomes SPRITES['name'] as a data URI (zero-dep, single-file law) ----
$spriteDir = Join-Path $dir 'sprites'
$spriteJs = 'var SPRITES={'
$spriteCount = 0
if (Test-Path $spriteDir) {
  $pngs = Get-ChildItem -Path $spriteDir -Filter '*.png' | Sort-Object Name
  $parts = @()
  foreach ($p in $pngs) {
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($p.FullName))
    $key = [System.IO.Path]::GetFileNameWithoutExtension($p.Name).ToLower()
    $parts += ('"' + $key + '":"data:image/png;base64,' + $b64 + '"')
    $spriteCount++
  }
  $spriteJs += ($parts -join ',')
}
$spriteJs += '};'

$head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>PAWRADE - your pets, in a bedtime parade</title><meta property="og:title" content="PAWRADE"><meta property="og:description" content="The whole world gets the same parade of pets. Link them home. Tuck them in before the sleepies win."><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Fredoka:wght@400;500;600&family=Caveat:wght@500;700&display=swap" rel="stylesheet"><style>'
$mid  = '</style></head><body>'
$tail = '</body></html>'

$full = $head + $css + $mid + $body + '<script>' + $spriteJs + $js + '</script>' + $tail
[System.IO.File]::WriteAllText((Join-Path $dir 'index.html'), $full, $utf8NoBom)
Write-Host ('index.html: ' + (Get-Item index.html).Length + ' bytes (no BOM, ASCII-safe, no external JS deps, ' + $spriteCount + ' sprites baked)')
