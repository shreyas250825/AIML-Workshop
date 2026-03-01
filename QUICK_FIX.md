# Quick Fix for Vercel Deployment

## Issue
Vercel build failed due to peer dependency conflict with @react-three/drei

## Solution
Updated `vercel.json` to use `--legacy-peer-deps` during installation.

## Commands to Run

```bash
cd workshop

# Stage the updated vercel.json
git add vercel.json

# Commit
git commit -m "Fix Vercel deployment - add legacy-peer-deps"

# Push to GitHub
git push origin main
```

Then in Vercel, click "Redeploy" and the build should succeed!
