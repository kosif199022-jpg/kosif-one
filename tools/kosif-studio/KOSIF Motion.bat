@echo off
chcp 65001 >nul
title KOSIF Motion
cd /d "%~dp0motion"
python kmotion.py %*
echo.
pause
