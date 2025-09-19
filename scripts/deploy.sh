#!/bin/bash

# PRIMA Dashboard Deployment Script
# Run this from Cursor terminal: ./scripts/deploy.sh

set -e

echo "🚀 Starting PRIMA Dashboard deployment..."

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Error: You must be on the main branch to deploy"
    echo "Current branch: $current_branch"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes. Please commit them first."
    git status --short
    exit 1
fi

echo "✅ Branch check passed"

# Build the project
echo "🔨 Building project..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Push to GitHub (this will trigger Vercel auto-deploy if connected)
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Push failed. Please check your git configuration."
    exit 1
fi

echo "✅ Pushed to GitHub"

# If Vercel CLI is available, also deploy directly
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod --yes
    echo "✅ Vercel deployment complete"
else
    echo "ℹ️  Vercel CLI not found. If you have Vercel connected to GitHub, it will auto-deploy."
fi

echo "🎉 Deployment process complete!"
echo "Check your Vercel dashboard for the live URL."
