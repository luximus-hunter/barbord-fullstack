# Remove node_modules directories
Get-ChildItem -Path . -Recurse -Directory -Name "node_modules" | ForEach-Object {
    $path = Join-Path -Path (Get-Location) $_
    Write-Host "Removing $path"
    Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove dist directories
Get-ChildItem -Path . -Recurse -Directory -Name "dist" | ForEach-Object {
    $path = Join-Path -Path (Get-Location) $_
    Write-Host "Removing $path"
    Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove .turbo directories
Get-ChildItem -Path . -Recurse -Directory -Name ".turbo" | ForEach-Object {
    $path = Join-Path -Path (Get-Location) $_
    Write-Host "Removing $path"
    Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove target directories in desktop app
Get-ChildItem -Path . -Recurse -Directory -Filter "target" | ForEach-Object {
    if ($_.FullName -like "*apps\desktop\src-tauri\*") {
        $path = $_.FullName
        Write-Host "Removing $path"
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Reset complete!"
