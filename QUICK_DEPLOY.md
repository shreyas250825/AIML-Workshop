# Quick Deployment Guide

## Why is deployment failing?

Your Vercel deployment shows:
```
Warning: Failed to fetch one or more git submodules
npm error enoent Could not read package.json
```

This happens because you're trying to deploy the parent repository, but `workshop` is a git submodule that Vercel can't access.

## Solution (3 Simple Steps)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `workshop-platform`)
3. Don't initialize with README (we already have code)
4. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/workshop-platform.git`)

### Step 2: Push Workshop Code

Open terminal in the workshop directory and run:

```bash
cd workshop

# Stage all files
git add .

# Commit
git commit -m "Workshop platform deployment"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/workshop-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**OR** run the automated script:
- Windows: Double-click `setup-github.bat`
- Mac/Linux: Run `bash setup-github.sh`

### Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your workshop repository
4. Click "Deploy" (Vercel auto-detects Next.js)

Done! Your app will be live in ~2 minutes.

## What if I get errors?

### "remote origin already exists"
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/workshop-platform.git
```

### "failed to push"
Make sure:
- Repository exists on GitHub
- You're logged into GitHub
- Repository URL is correct

### "permission denied"
You may need to authenticate:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Current Files Ready for Deployment

✅ All source code
✅ API routes configured
✅ Google Sheets integration
✅ Quiz system with leaderboard
✅ Materials and case studies
✅ Admin dashboard
✅ Build configuration

Everything is ready - just push to GitHub and deploy!
