#!/bin/bash

# Deploy script for Cloudflare Pages
# This script builds the site and deploys it to Cloudflare

echo "🚀 Building site for Cloudflare deployment..."

# Build the site
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Static files are ready in ./dist/"
    echo ""
    echo "🌐 To deploy to Cloudflare Pages:"
    echo "   1. Install Wrangler CLI: npm install -g wrangler"
    echo "   2. Login to Cloudflare: wrangler login"
    echo "   3. Deploy: wrangler pages deploy dist"
    echo ""
    echo "📋 Or upload ./dist/ folder manually to Cloudflare Pages dashboard"
else
    echo "❌ Build failed!"
    exit 1
fi
