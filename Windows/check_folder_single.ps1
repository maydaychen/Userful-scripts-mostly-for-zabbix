$Path = "D:\"

$files = Get-ChildItem -Path $Path -File -Recurse | Where-Object {
    -not ($_.FullName -like "*\backup\*")
    # except backup folder
} | ForEach-Object {
    @{
        "{#FULLPATH}" = $_.FullName
    }
}

$files | ConvertTo-Json -Depth 1


# UserParameter=file_check_D_Apps,powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Program Files\zabbix\scripts\check_folder_single.ps1"