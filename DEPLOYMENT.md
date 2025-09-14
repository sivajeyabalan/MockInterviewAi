# 🚀 MockAI Deployment Guide

## Platform Comparison

| Platform             | Best For        | Free Tier   | Ease       | Performance | Firebase Integration |
| -------------------- | --------------- | ----------- | ---------- | ----------- | -------------------- |
| **Vercel**           | React/Vite apps | ✅ Generous | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐             |
| **Netlify**          | Static sites    | ✅ Good     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐⭐             |
| **Firebase Hosting** | Firebase apps   | ✅ Good     | ⭐⭐⭐     | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐           |
| **Render**           | Full-stack      | ✅ Limited  | ⭐⭐⭐⭐   | ⭐⭐⭐      | ⭐⭐⭐               |

## 🎯 Option 1: Vercel (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free)
- Your project pushed to GitHub

### Step 1: Prepare Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your actual Firebase and Google AI API keys
3. **Never commit `.env.local` to Git**

### Step 2: Deploy to Vercel

#### Method A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mockai (or your preferred name)
# - Directory? ./
# - Override settings? No
```

#### Method B: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_AI_API_KEY=your_google_ai_key
   ```
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🌐 Option 2: Netlify

### Step 1: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings (auto-detected from netlify.toml)
5. Add environment variables in Site Settings → Environment Variables
6. Deploy!

---

## 🔥 Option 3: Firebase Hosting

### Step 1: Update Firebase Config

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 2: Deploy

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting (if not already done)
firebase init hosting

# Build your project
npm run build

# Deploy
firebase deploy
```

---

## 🎨 Option 4: Render

### Step 1: Create render.yaml

```yaml
services:
  - type: web
    name: mockai
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_FIREBASE_API_KEY
        sync: false
      - key: VITE_FIREBASE_AUTH_DOMAIN
        sync: false
      - key: VITE_FIREBASE_PROJECT_ID
        sync: false
      - key: VITE_FIREBASE_STORAGE_BUCKET
        sync: false
      - key: VITE_FIREBASE_MESSAGING_SENDER_ID
        sync: false
      - key: VITE_FIREBASE_APP_ID
        sync: false
      - key: VITE_GOOGLE_AI_API_KEY
        sync: false
```

### Step 2: Deploy

1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: mockai
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Add environment variables
6. Deploy!

---

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables

- [ ] Copy `env.example` to `.env.local`
- [ ] Add all required environment variables
- [ ] Test locally with `npm run dev`

### 2. Build Optimization

- [ ] Run `npm run build` locally
- [ ] Check `dist` folder is created
- [ ] Test build with `npm run preview`

### 3. Firebase Configuration

- [ ] Update Firebase project settings
- [ ] Add your domain to authorized domains
- [ ] Configure CORS if needed

### 4. Performance

- [ ] Test on slow networks
- [ ] Check Lighthouse scores
- [ ] Optimize images and assets

---

## 🚨 Common Issues & Solutions

### Issue 1: Environment Variables Not Working

**Solution**: Ensure all variables start with `VITE_` prefix

### Issue 2: Firebase Auth Not Working

**Solution**: Add your domain to Firebase Auth settings

### Issue 3: Build Fails

**Solution**: Check Node.js version (use 18.x)

### Issue 4: Routing Issues

**Solution**: Ensure SPA redirects are configured

---

## 📊 Performance Optimization

### 1. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev vite-bundle-analyzer

# Add to vite.config.ts
import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
  plugins: [
    react(),
    analyzer()
  ]
})
```

### 2. Image Optimization

- Use WebP format
- Implement lazy loading
- Optimize image sizes

### 3. Code Splitting

- Already configured in vite.config.ts
- Lazy load routes
- Dynamic imports for heavy components

---

## 🔄 Continuous Deployment

### GitHub Actions (Vercel/Netlify)

Both platforms auto-deploy on push to main branch.

### Manual Deployment

```bash
# Build
npm run build

# Deploy (Vercel)
vercel --prod

# Deploy (Firebase)
firebase deploy
```

---

## 📈 Monitoring & Analytics

### 1. Vercel Analytics

- Built-in performance monitoring
- Real user metrics
- Core Web Vitals

### 2. Firebase Analytics

- User behavior tracking
- Performance monitoring
- Error reporting

### 3. Google Analytics

- Add GA4 tracking
- Custom events
- Conversion tracking

---

## 🎯 Recommended Setup

**For Production**: Vercel + Firebase + Custom Domain
**For Development**: Vercel Preview Deployments
**For Staging**: Netlify Branch Deploys

Choose Vercel for the best developer experience and performance!
