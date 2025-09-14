#!/bin/bash

# Build script for Vercel deployment
echo "🚀 Starting build process..."

# Set environment variables
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"

# TypeScript compilation
echo "📝 Compiling TypeScript..."
./node_modules/.bin/tsc -b

# Vite build
echo "🏗️ Building with Vite..."
./node_modules/.bin/vite build

echo "✅ Build completed successfully!"
