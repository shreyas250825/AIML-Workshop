# Vercel Deployment Guide

## Build Status
✅ Local build successful
✅ Dynamic routes configured
✅ All API routes working

## ⚠️ IMPORTANT: Submodule Issue

Your current deployment is failing because:
- The parent repository has `workshop` as a git submodule
- Vercel shows: "Warning: Failed to fetch one or more git submodules"
- This means the workshop folder is empty during build, causing the error

## ✅ SOLUTION: Deploy Workshop Repository Directly

**You MUST deploy the workshop repository separately, not the parent repository.**

### Step 1: Push Workshop to GitHub

The workshop folder needs its own GitHub repository. Run these commands:

```bash
cd workshop

# Add all files
git add .

# Commit
git commit -m "Workshop platform ready for deployment"

# Add your GitHub repo as remote (create the repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/workshop-platform.git

# Push to GitHub
git push -u origin master
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your workshop repository (the one you just pushed)
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

That's it! No special configuration needed.

## Environment Variables

No environment variables are required. All Google Apps Script URLs are hardcoded in the proxy routes.

## Build Configuration

The following files configure the build:

- `next.config.mjs` - Next.js configuration with ESLint/TypeScript error ignoring
- `vercel.json` - Framework specification
- API routes have `export const dynamic = 'force-dynamic'` to prevent static generation errors

## API Routes (Dynamic)

All API routes are configured as dynamic:
- `/api/auth/proxy` - Authentication proxy
- `/api/quiz/leaderboard` - Quiz leaderboard with ranking
- `/api/quiz/leaderboard-proxy` - Google Sheets quiz data proxy
- `/api/quiz/submit` - Quiz submission
- `/api/quiz/validate` - Quiz password validation
- `/api/sheets/append` - Append data to sheets
- `/api/sheets/update-login` - Update login data

## Troubleshooting

### Error: "Could not read package.json"
**Cause**: Vercel is trying to build from root instead of workshop directory
**Solution**: Set Root Directory to `workshop` in Vercel settings

### Error: "Failed to fetch git submodules"
**Cause**: Workshop is a submodule and Vercel can't clone it
**Solution**: Deploy the workshop repository directly instead

### Error: "Dynamic server usage: Route couldn't be rendered statically"
**Cause**: API routes trying to use dynamic values during static generation
**Solution**: Already fixed - all API routes have `export const dynamic = 'force-dynamic'`

## Post-Deployment Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Login/Signup works
- [ ] Quiz page loads and validates passwords
- [ ] Quiz submission works
- [ ] Leaderboard displays quiz results with correct ranking
- [ ] Materials page shows all datasets
- [ ] Case studies load correctly
- [ ] Admin dashboard accessible

## Google Apps Script URLs

The following Google Apps Script URLs are configured:

**Auth Data:**
```
https://script.google.com/macros/s/AKfycbwtKXv3WosoYvmVKsl0l-hwr2BTO7faCECypR-JnSzaAwlqnlJ865b0zmACC49dHOeu/exec
```

**Quiz Data:**
```
https://script.google.com/macros/s/AKfycby7RWePhH2TyrdUXzq3AFVfwCYpLlnTpfsD2chErov4buxVKhTKarKcDk-gHNeJr2Y/exec
```

These are hardcoded in:
- `workshop/app/api/auth/proxy/route.ts`
- `workshop/app/api/quiz/leaderboard-proxy/route.ts`
