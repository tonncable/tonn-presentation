@echo off
title Publish Tonn Cable Website
echo ============================================
echo   PUBLISHING TONN CABLE WEBSITE
echo   Step 1: Push to GitHub (auto-deploys GitHub Pages)
echo   Step 2: Sync to company server
echo ============================================
echo.

cd /d "%~dp0"

echo [1/2] Pushing to GitHub...
git add -A
git commit -m "Update website content"
git push
echo.

echo [2/2] Syncing to company server: \\tonncable\web\Tonn Presentation\tonn-presentation ...
robocopy "%~dp0." "\\tonncable\web\Tonn Presentation\tonn-presentation" /E /XO /XD ".git" "node_modules"
echo.

echo ============================================
echo   DONE.
echo   - GitHub Pages: https://tonncable.github.io/tonn-presentation/
echo     (takes ~1 minute to update)
echo   - Company server updated
echo.
echo   Refresh your browser with Ctrl + F5.
echo ============================================
echo.
pause
