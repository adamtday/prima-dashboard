# 🚀 Quick Start: Professional Deployment

## For Beginners - Step by Step

### **1. Initial Setup (One-time)**

```bash
# Run the setup script
./scripts/setup-deployment.sh

# This will:
# - Install Vercel CLI
# - Link your project to Vercel
# - Create environment files
# - Run quality checks
# - Set up Git hooks
```

### **2. Configure GitHub Secrets**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `VERCEL_TOKEN` - Get from Vercel dashboard → Settings → Tokens
   - `VERCEL_ORG_ID` - Get from `.vercel/project.json` after linking
   - `VERCEL_PROJECT_ID` - Get from `.vercel/project.json` after linking

### **3. Set Up Branch Protection**

1. Go to GitHub repo → **Settings** → **Branches**
2. Click **Add rule**
3. For `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Require branches to be up to date
4. For `develop` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks

## 🔄 Daily Workflow

### **Making Changes:**

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... code changes ...

# 3. Test locally
npm run dev
# Test your changes at http://localhost:3001

# 4. Run quality checks
npm run type-check
npm run lint
npm run format:fix

# 5. Commit changes
git add .
git commit -m "feat: add your feature"

# 6. Push and create PR
git push origin feature/your-feature-name
# Create PR on GitHub
```

### **Deploying to Staging:**

```bash
# 1. Merge PR to develop branch
# (This happens on GitHub)

# 2. GitHub Actions automatically deploys to staging
# Check: https://github.com/your-repo/actions

# 3. Test staging deployment
# URL will be provided in GitHub Actions logs
```

### **Deploying to Production:**

```bash
# 1. Merge develop to main branch
# (This happens on GitHub)

# 2. GitHub Actions automatically deploys to production
# Check: https://github.com/your-repo/actions

# 3. Verify production deployment
# Check your live URL
```

## 🆘 Emergency Procedures

### **Quick Rollback:**
```bash
# Rollback to previous deployment
npm run deploy:rollback

# Or redeploy specific version
npx vercel redeploy [deployment-url]
```

### **Manual Deployment:**
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 📊 Monitoring

### **Check Deployment Status:**
```bash
# View all deployments
npm run deploy:status

# View deployment logs
npm run deploy:logs
```

### **GitHub Actions:**
- Go to your repo → **Actions** tab
- See all deployment history
- Check for failed deployments

### **Vercel Dashboard:**
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- See deployment analytics
- Check performance metrics

## 🎯 Best Practices

### **Before Every Commit:**
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Run `npm run format:fix`
- [ ] Test your changes locally

### **Before Every PR:**
- [ ] All quality checks pass
- [ ] Code is reviewed by yourself
- [ ] No console.log statements
- [ ] Documentation updated if needed

### **Before Production:**
- [ ] Staging environment tested
- [ ] All team members approve
- [ ] Rollback plan ready
- [ ] Monitoring configured

## 🔧 Troubleshooting

### **Build Fails:**
1. Check TypeScript errors: `npm run type-check`
2. Check ESLint errors: `npm run lint`
3. Fix formatting: `npm run format:fix`
4. Check dependencies: `npm install`

### **Deployment Fails:**
1. Check GitHub Actions logs
2. Check Vercel dashboard
3. Verify environment variables
4. Check branch protection rules

### **Environment Issues:**
1. Check `.env.local` file
2. Verify Vercel environment variables
3. Check GitHub secrets
4. Re-run setup script

## 📚 Need Help?

- 📖 Read `DEPLOYMENT_GUIDE.md` for detailed information
- 🔧 Check `ENVIRONMENT_SETUP.md` for environment configuration
- 🌿 See `BRANCH_PROTECTION.md` for branch rules
- 💬 Ask questions in GitHub Issues

---

**Remember**: Start simple, add complexity gradually. Focus on getting a working pipeline first!
