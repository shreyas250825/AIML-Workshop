@echo off
REM Workshop GitHub Setup Script for Windows
REM This script helps you push the workshop code to GitHub

echo ===================================
echo Workshop GitHub Setup
echo ===================================
echo.

REM Check if we're in the workshop directory
if not exist "package.json" (
    echo Error: Please run this script from the workshop directory
    exit /b 1
)

echo In workshop directory
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
)

echo Current git status:
git status --short
echo.

REM Ask for GitHub repository URL
echo Please create a new repository on GitHub first, then enter the URL below:
echo Example: https://github.com/YOUR_USERNAME/workshop-platform.git
set /p REPO_URL="GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty
    exit /b 1
)

echo.
echo Setting up remote...

REM Check if origin already exists
git remote | findstr "origin" >nul
if %errorlevel%==0 (
    echo Remote 'origin' already exists. Updating...
    git remote set-url origin "%REPO_URL%"
) else (
    git remote add origin "%REPO_URL%"
)

echo Remote configured: %REPO_URL%
echo.

REM Stage all files
echo Staging all files...
git add .

REM Commit
echo Creating commit...
git commit -m "Workshop platform ready for deployment - Next.js app with Google Sheets integration, quiz system, leaderboard, case studies, and admin dashboard"

echo Commit created
echo.

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ===================================
    echo SUCCESS!
    echo ===================================
    echo.
    echo Your workshop code is now on GitHub!
    echo.
    echo Next steps:
    echo 1. Go to https://vercel.com/new
    echo 2. Import your repository: %REPO_URL%
    echo 3. Click Deploy
    echo.
    echo Vercel will auto-detect Next.js and deploy your app.
) else (
    echo.
    echo Push failed. Please check:
    echo 1. Repository exists on GitHub
    echo 2. You have push access
    echo 3. Repository URL is correct
)

pause
