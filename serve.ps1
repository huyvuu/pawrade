$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8789/')
$listener.Start()
Write-Host 'Serving PAWRADE on http://localhost:8789/'
$root = 'F:\110. Accordant Backup Offline\!2. Temp\Research\PAWRADE'
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }
    $file = Join-Path $root $path
    if (Test-Path $file) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file)
      $ct = 'text/html; charset=utf-8'
      if ($ext -eq '.js') { $ct = 'application/javascript; charset=utf-8' }
      if ($ext -eq '.css') { $ct = 'text/css; charset=utf-8' }
      $ctx.Response.ContentType = $ct
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $ctx.Response.StatusCode = 404 }
    $ctx.Response.Close()
  } catch { }
}
