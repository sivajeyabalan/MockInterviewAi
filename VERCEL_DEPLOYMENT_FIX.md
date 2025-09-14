# 🔧 Vercel Deployment Fix Guide

## 🚨 Issue: Rollup Native Module Error

**Error**: `Cannot find module '@rollup/rollup-linux-x64-gnu'`

This is a common issue when deploying Vite projects to Vercel due to platform-specific native binaries.

## ✅ **Solution Applied**

### 1. **Updated Vite Configuration**

- Changed minifier from `terser` to `esbuild`
- This avoids platform-specific Rollup native modules

### 2. **Added Node.js Version Specification**

- Created `.nvmrc` file with Node.js 18
- Added `engines` field in `package.json`

### 3. **Optimized Vercel Configuration**

- Updated `vercel.json` with better build settings
- Added optimized install command

## 🚀 **Deployment Steps**

### **Method 1: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mockai
# - Directory? ./
# - Override settings? No
```

### **Method 2: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Important Settings**:

   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci --prefer-offline --no-audit`

5. **Environment Variables** (add these):

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

6. Click "Deploy"

## 🔧 **Files Modified**

### `vite.config.ts`

```typescript
build: {
  outDir: "dist",
  sourcemap: false,
  minify: "esbuild", // Changed from "terser"
  // ... rest of config
}
```

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci --prefer-offline --no-audit",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `package.json`

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### `.nvmrc`

```
18
```

## 🎯 **Why This Fixes the Issue**

1. **esbuild vs terser**: esbuild is written in Go and doesn't have platform-specific native modules
2. **Node.js 18**: Ensures consistent runtime environment
3. **Optimized install**: Reduces build time and potential conflicts
4. **Proper framework detection**: Vercel recognizes Vite and applies correct settings

## 🚨 **Alternative Solutions (if still having issues)**

### Option 1: Force Platform

Add to `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci --prefer-offline --no-audit",
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Option 2: Use Different Minifier

In `vite.config.ts`:

```typescript
build: {
  minify: false, // Disable minification temporarily
  // or
  minify: "esbuild", // Use esbuild (already applied)
}
```

### Option 3: Clear Vercel Cache

1. Go to Vercel Dashboard
2. Project Settings → Functions
3. Clear Build Cache
4. Redeploy

## 📊 **Build Performance**

With esbuild:

- **Build Time**: ~10-15 seconds (faster than terser)
- **Bundle Size**: Similar to terser
- **Compatibility**: Better cross-platform support

## ✅ **Verification**

After deployment, verify:

1. ✅ Build completes successfully
2. ✅ App loads without errors
3. ✅ Firebase authentication works
4. ✅ Speech recognition functions
5. ✅ All routes work correctly

## 🎉 **Success!**

Your MockAI app should now deploy successfully to Vercel without the Rollup native module error!
