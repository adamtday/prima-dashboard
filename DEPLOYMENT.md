# Deployment Guide

This guide covers deploying the Prima Dashboard to both staging and production environments.

## ✅ Current Status

**DEPLOYED**: The Prima Dashboard is currently deployed and accessible at:

- **Production**: [prima-dashboard.vercel.app](https://prima-dashboard.vercel.app)
- **Staging**: Available via Vercel dashboard

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) ✅ Connected
2. **Vercel CLI**: Available via `npx vercel` ✅ Ready
3. **GitHub Repository**: [github.com/adamtday/prima-dashboard](https://github.com/adamtday/prima-dashboard) ✅ Connected

## Environment Setup

### 1. Vercel Project Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)

### 2. Environment Variables

Set up the following environment variables in Vercel:

#### Production Environment

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Prima Dashboard
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_MSW_ENABLED=false
NEXT_PUBLIC_FEATURE_MOCK_DATA=false
NEXT_PUBLIC_FEATURE_ANALYTICS=true
```

#### Staging Environment

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-staging-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Prima Dashboard (Staging)
NEXT_PUBLIC_API_BASE_URL=https://your-staging-domain.vercel.app/api
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_MSW_ENABLED=true
NEXT_PUBLIC_FEATURE_MOCK_DATA=true
NEXT_PUBLIC_FEATURE_ANALYTICS=false
```

## Deployment Methods

### Method 1: Automatic Deployment (Recommended) ✅

The project is configured with **Vercel's GitHub Integration** for automatic deployment:

- **Production**: Deploys automatically when code is pushed to the `main` branch
- **Staging**: Deploys automatically when code is pushed to the `staging` branch
- **Preview**: Deploys automatically for all pull requests

### Method 2: Git-Based Deployment Workflow

#### Current Git Workflow

```bash
# 1. Development on feature branches
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 2. Create Pull Request to main
# GitHub will automatically create a preview deployment

# 3. After PR approval, merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
# This triggers automatic production deployment

# 4. Deploy to staging for demos
git checkout staging
git pull origin staging
git merge main
git push origin staging
# This triggers automatic staging deployment
```

#### Branch Strategy

- **`main`** → Production deployment (prima-dashboard.vercel.app)
- **`staging`** → Staging deployment (for demos and testing)
- **`feature/*`** → Preview deployments (for development)

### Method 3: Manual Vercel CLI Deployment

1. **Login to Vercel**:
   ```bash
   npx vercel login
   ```

2. **Link Project** (if not already linked):
   ```bash
   npx vercel link
   ```

3. **Deploy**:
   ```bash
   # Deploy to preview
   npx vercel
   
   # Deploy to staging
   npx vercel --prod=false
   
   # Deploy to production
   npx vercel --prod=true
   ```

## 🔄 Current Deployment Workflow

### Daily Development Workflow

```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: implement your feature"
git push origin feature/your-feature-name

# 3. Create Pull Request
# - GitHub automatically creates preview deployment
# - Review code and test preview
# - Merge to main when ready

# 4. Production deployment (automatic)
git checkout main
git pull origin main
# Vercel automatically deploys to production

# 5. Update staging for demos (if needed)
git checkout staging
git pull origin staging
git merge main
git push origin staging
# Vercel automatically deploys to staging
```

### Branch Strategy

- **`main`**: Production branch - deploys to production environment
- **`staging`**: Staging branch - deploys to staging environment  
- **`feature/*`**: Feature branches - create preview deployments
- **`hotfix/*`**: Emergency fixes - can be deployed directly

### Environment URLs

- **Production**: [prima-dashboard.vercel.app](https://prima-dashboard.vercel.app)
- **Staging**: Available via Vercel dashboard
- **Preview**: Generated for each pull request

## GitHub Actions Setup

To enable automatic deployment, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## Monitoring and Maintenance

### Health Checks

- Production: `https://your-domain.vercel.app/api/test`
- Staging: `https://your-staging-domain.vercel.app/api/test`

### Logs

- View deployment logs in Vercel Dashboard
- Monitor application logs in Vercel Functions tab

### Performance

- Monitor Core Web Vitals in Vercel Analytics
- Check build performance in Vercel Dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (should be 18.x)
   - Verify all dependencies are installed
   - Check for TypeScript/ESLint errors

2. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no trailing spaces

3. **Deployment Issues**:
   - Check Vercel logs for specific errors
   - Verify GitHub Actions secrets are correct
   - Ensure proper branch permissions

### Getting Help

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review GitHub Actions logs in your repository
- Contact support through Vercel dashboard

## Security Considerations

- Never commit environment variables to the repository
- Use Vercel's environment variable management
- Regularly rotate API tokens and secrets
- Enable Vercel's security features (DDoS protection, etc.)

## Performance Optimization

- Enable Vercel's Edge Functions for better performance
- Use Vercel's Image Optimization
- Configure proper caching headers
- Monitor bundle size and optimize accordingly
