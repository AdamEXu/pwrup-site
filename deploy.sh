#!/bin/bash

# Deploy script for Cloudflare Workers
# This script builds the site and deploys it to Cloudflare Workers

echo "🚀 Building site for Cloudflare Workers deployment..."

# Build the site
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Static files are ready in ./dist/"
    echo ""
    echo "🌐 To deploy to Cloudflare Workers:"
    echo ""
    echo "� Option 1: Direct Deploy with Wrangler (Recommended)"
    echo "   1. Install Wrangler CLI: npm install -g wrangler"
    echo "   2. Login to Cloudflare: wrangler login"
    echo "   3. Deploy: wrangler deploy"
    echo ""
    echo "📋 Option 2: Use the deploy script"
    echo "   1. Run: pnpm deploy"
    echo ""
    echo "🧪 After deployment, test compression:"
    echo "   node test-compression.js https://your-site.workers.dev"
else
    echo "❌ Build failed!"
    exit 1
fi
