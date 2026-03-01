# BMW M4 3D Model Setup

## Current Status
The Scene3D component has been updated to use the BMW M4 Widebody model instead of the abstract shapes.

## Required Action
The BMW model folder needs to be moved to the `public` directory so Next.js can serve it.

### Commands to Run

**Windows (PowerShell):**
```powershell
cd workshop
Move-Item -Path "bmw-m4-widebody-wwwvecarzcom" -Destination "public/bmw-m4-widebody-wwwvecarzcom"
```

**Mac/Linux:**
```bash
cd workshop
mv bmw-m4-widebody-wwwvecarzcom public/
```

### After Moving

1. Commit and push the changes:
```bash
git add .
git commit -m "Add BMW M4 3D model to Scene3D component"
git push origin main
```

2. Vercel will automatically redeploy

## What Changed

- `Scene3D.tsx` now loads the BMW M4 GLB model
- Auto-rotation enabled for the car
- OrbitControls added so users can interact with the model (zoom, rotate)
- Improved lighting for better car visualization
- Particle system still present for visual effect

## Features

- Interactive 3D BMW M4 Widebody model
- Auto-rotation animation
- User can zoom and rotate the camera
- Optimized loading with Suspense
- Fallback loader while model loads
