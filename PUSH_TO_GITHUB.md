# Push Workshop to GitHub

You've already committed your changes. Now just push to your repository:

## Commands to Run

```bash
# Add the remote repository (you need to give it a name like "origin")
git remote add origin https://github.com/shreyas250825/AIML-Workshop.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## If "origin" already exists

If you get an error that "origin" already exists, update it:

```bash
git remote set-url origin https://github.com/shreyas250825/AIML-Workshop.git
git branch -M main
git push -u origin main
```

## If GitHub repository has existing content

If you get "rejected" error because remote has content you don't have locally:

**Option 1: Force push (replaces everything on GitHub with your local code)**
```bash
git push -u origin main --force
```

**Option 2: Pull and merge first (safer, keeps GitHub content)**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**Recommended: Use Option 1 (force push)** since you want to deploy your complete workshop code.

## After Pushing Successfully

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository: `shreyas250825/AIML-Workshop`
4. Vercel will auto-detect Next.js
5. Click "Deploy"

Done! Your app will be live in ~2 minutes.

## Current Status

✅ Files committed
⏳ Need to push to GitHub
⏳ Need to deploy to Vercel
