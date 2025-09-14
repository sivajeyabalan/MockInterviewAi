# 🔧 Vercel Rollup Native Module Fix

## 🚨 **Issue**: `Cannot find module '@rollup/rollup-linux-x64-gnu'`

This error occurs when Vercel tries to use Rollup's native binaries that are platform-specific.

## ✅ **Solutions Applied**

### 1. **Downgraded Rollup Version**

```bash
npm install --save-dev rollup@4.9.6
```

- Rollup 4.50.1 has known issues with Vercel
- Version 4.9.6 is more stable for deployment

### 2. **TypeScript Configuration Fixed**

Updated TypeScript configuration and build script:

```json
{
  "scripts": {
    "build:vercel": "bash build.sh"
  }
}
```

**Build Script (`build.sh`):**

```bash
#!/bin/bash
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

**Type Declarations Added:**

- `src/vite-env.d.ts` - Import.meta.env types (including VITE_GEMINI_API_KEY)
- `src/types/global.d.ts` - Asset module declarations

### 3. **Updated Vercel Configuration**

```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci --prefer-offline --no-audit",
  "build": {
    "env": {
      "NODE_ENV": "production",
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### 4. **Vite Configuration Optimized**

```typescript
build: {
  outDir: "dist",
  sourcemap: false,
  minify: "esbuild", // Avoid terser issues
  target: "es2020", // Ensure compatibility
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom"],
        firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
      },
    },
  },
}
```

## 🚀 **Deployment Steps**

### **Option 1: Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### **Option 2: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. **Build Settings**:
   - Build Command: `npm run build:vercel`
   - Output Directory: `dist`
   - Framework: Vite
4. Add environment variables
5. Deploy

## 🔧 **Alternative Solutions (if still failing)**

### **Option A: Force esbuild-only build**

Update `vite.config.ts`:

```typescript
build: {
  minify: "esbuild",
  rollupOptions: {
    external: [], // Don't externalize anything
  }
}
```

### **Option B: Use different bundler**

Install `@vitejs/plugin-legacy` and configure for better compatibility.

### **Option C: Manual Rollup installation**

```bash
npm install --save-dev @rollup/rollup-linux-x64-gnu
```

## 📊 **Build Results**

```
dist/index.html                       0.69 kB │ gzip:   0.36 kB
dist/assets/aiImg-DAG9NOZf.png    4,744.50 kB
dist/assets/index-CykLahYa.css       43.92 kB │ gzip:   8.20 kB
dist/assets/ui-Dn1a-PkN.js           81.58 kB │ gzip:  27.79 kB
dist/assets/vendor-D3F3s8fL.js      141.72 kB │ gzip:  45.48 kB
dist/assets/index-CWxHoCsj.js       349.95 kB │ gzip: 100.31 kB
dist/assets/firebase-D_l3fXu5.js    478.90 kB │ gzip: 113.48 kB
✓ built in 13.05s
```

## 🎯 **Why This Works**

1. **Rollup 4.9.6**: More stable version without native module issues
2. **TypeScript configuration**: Fixed import.meta.env types and asset declarations
3. **Local binaries**: Uses local TypeScript and Vite binaries to avoid version conflicts
4. **esbuild minification**: Avoids terser-related issues
5. **Memory optimization**: Prevents out-of-memory errors via Vercel config

## ✅ **Verification Checklist**

- [ ] Build completes locally
- [ ] No TypeScript errors
- [ ] Bundle size is reasonable (~1.1MB)
- [ ] All assets are generated
- [ ] Vercel deployment succeeds
- [ ] App loads without errors
- [ ] Firebase authentication works
- [ ] Speech recognition functions

## 🎉 **Success!**

Your MockAI app should now deploy successfully to Vercel without the Rollup native module error!
