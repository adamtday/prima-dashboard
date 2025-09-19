# 🔧 Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Authentication (for production)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# Database (if using external DB)
DATABASE_URL=postgresql://username:password@localhost:5432/primaclient

# External Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

### **Staging Environment:**
- `NODE_ENV` = `staging`
- `NEXT_PUBLIC_APP_ENV` = `staging`
- `NEXT_PUBLIC_API_URL` = `https://api-staging.primaclient.co`

### **Production Environment:**
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_APP_ENV` = `production`
- `NEXT_PUBLIC_API_URL` = `https://api.primaclient.co`

## GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `VERCEL_TOKEN` - Get from Vercel dashboard
   - `VERCEL_ORG_ID` - Get from Vercel dashboard
   - `VERCEL_PROJECT_ID` - Get from Vercel dashboard

## Getting Vercel Credentials

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel login`
3. Run: `vercel link`
4. Get credentials from `.vercel/project.json`
