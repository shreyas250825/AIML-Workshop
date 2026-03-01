#!/bin/bash

# Workshop GitHub Setup Script
# This script helps you push the workshop code to GitHub

echo "==================================="
echo "Workshop GitHub Setup"
echo "==================================="
echo ""

# Check if we're in the workshop directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the workshop directory"
    exit 1
fi

echo "✅ In workshop directory"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

echo "Current git status:"
git status --short
echo ""

# Ask for GitHub repository URL
echo "Please create a new repository on GitHub first, then enter the URL below:"
echo "Example: https://github.com/YOUR_USERNAME/workshop-platform.git"
read -p "GitHub Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL cannot be empty"
    exit 1
fi

echo ""
echo "Setting up remote..."

# Check if origin already exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' already exists. Updating..."
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi

echo "✅ Remote configured: $REPO_URL"
echo ""

# Stage all files
echo "Staging all files..."
git add .

# Commit
echo "Creating commit..."
git commit -m "Workshop platform ready for deployment

- Next.js 14 application
- Google Sheets integration
- Quiz system with leaderboard
- Case studies and materials
- Admin dashboard
- All features complete and tested"

echo "✅ Commit created"
echo ""

# Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "==================================="
    echo "✅ SUCCESS!"
    echo "==================================="
    echo ""
    echo "Your workshop code is now on GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import your repository: $REPO_URL"
    echo "3. Click Deploy"
    echo ""
    echo "Vercel will auto-detect Next.js and deploy your app."
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub"
    echo "2. You have push access"
    echo "3. Repository URL is correct"
fi
