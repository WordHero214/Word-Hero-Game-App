@echo off
REM ========================================
REM Move .md files to docs folder
REM (except README.md)
REM ========================================

echo.
echo ========================================
echo   Moving .md files to docs folder
echo ========================================
echo.

set count=0

for %%f in (*.md) do (
    if /i not "%%f"=="README.md" (
        echo Moving: %%f
        move "%%f" "docs\" >nul 2>&1
        if errorlevel 1 (
            echo [ERROR] Failed to move %%f
        ) else (
            set /a count+=1
        )
    )
)

echo.
if %count%==0 (
    echo [OK] No files to move. All .md files are already organized!
) else (
    echo [OK] Moved %count% file(s) to docs folder
)

echo.
echo Current .md files in root:
dir *.md /b 2>nul
if errorlevel 1 (
    echo   (none - only README.md should be here)
) else (
    echo.
)

echo.
pause
