# Workshop Deployment Steps

## Problem
The parent repository has `workshop` as a git submodule, but Vercel can't fetch submodules during deployment. This causes the build to fail because the workshop folder is empty.

## Solution
Deploy the workshop repository directly to Vercel.

## Step-by-Step Instructions

### 1. Create a GitHub Repository for Workshop

Go to GitHub and create a new repository (e.g., `workshop-platform` or `ai-workshop-app`)

### 2. Push Workshop Code to GitHub

Run these commands from inside the `workshop` directory:

```bash
cd workshop

# Add all files
git add .

# Commit changes
git commit -m "Initial workshop platform commit"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin master
```

**Note:** If your default branch is `main` instead of `master`, use:
```bash
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose your workshop repository
5. Vercel will auto-detect Next.js settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
cd workshop
npm install -g vercel
vercel login
vercel --prod
```

### 4. Verify Deployment

After deployment, test these features:
- [ ] Homepage loads
- [ ] Login/Signup works
- [ ] Quiz page validates passwords
- [ ] Quiz submission works
- [ ] Leaderboard shows rankings
- [ ] Materials page displays datasets
- [ ] Case studies load
- [ ] Admin dashboard accessible

## Alternative: Fix Submodule Deployment (Not Recommended)

If you must deploy from the parent repository:

1. In the parent repository, ensure the submodule is properly configured:
   ```bash
   cd "C:\Users\shrey\OneDrive\Desktop\AI Workshop"
   git submodule add https://github.com/YOUR_USERNAME/workshop.git workshop
   git submodule update --init --recursive
   git commit -m "Add workshop submodule"
   git push
   ```

2. In Vercel project settings:
   - Set Root Directory to `workshop`
   - Enable "Include source files outside of the Root Directory in the Build Step"

However, this approach is more complex and error-prone. **Deploying the workshop repository directly is strongly recommended.**

## Current Status

✅ Build works locally
✅ All API routes configured as dynamic
✅ Code ready for deployment
❌ Workshop repository not pushed to GitHub yet
❌ Vercel deployment pending

## Next Steps

1. Create GitHub repository for workshop
2. Push workshop code (see commands above)
3. Deploy to Vercel from the workshop repository
4. Test all features post-deployment
