$Paths = @("D:\Apps", "D:\Apps1")

$files = foreach ($Path in $Paths) {
    Get-ChildItem -Path $Path -Directory -Recurse | Where-Object {
        -not ($_.FullName -like "*\backup\*")
    } | ForEach-Object {
        @{
            "{#FULLPATH}" = $_.FullName
        }
    }
}

$files | ConvertTo-Json -Depth 1

UserParameter=file_check,powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Program Files\zabbix\scripts\check_folder_multipy.ps1"