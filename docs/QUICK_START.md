# Quick Start Guide

## 🚀 Current Project Status

**✅ PRODUCTION READY** - The Prima Dashboard is fully deployed and operational.

- **Production**: [prima-dashboard.vercel.app](https://prima-dashboard.vercel.app)
- **Repository**: [github.com/adamtday/prima-dashboard](https://github.com/adamtday/prima-dashboard)
- **Status**: All core modules implemented and deployed

## 🔄 Current Git & Deployment Workflow

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

- **`main`** → Production deployment (prima-dashboard.vercel.app)
- **`staging`** → Staging deployment (for demos and testing)
- **`feature/*`** → Preview deployments (for development)
- **`hotfix/*`** → Emergency fixes (can deploy directly)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Quick Setup
```bash
# Clone repository
git clone https://github.com/adamtday/prima-dashboard.git
cd prima-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Check Prettier formatting
pnpm format:fix   # Fix Prettier formatting
```

## 📊 Current Features

### ✅ Implemented Modules
- **Authentication** - Login, protected routes, user management
- **Overview Dashboard** - KPI metrics and real-time data
- **Bookings Management** - Status controls, filtering, CRUD operations
- **Pricing Configuration** - Prime/Non-Prime pricing setup
- **Promoters Module** - Leaderboard, performance tracking
- **Incentives System** - Create and manage incentive programs
- **Commissions Management** - Tiered commission structure
- **Finance Dashboard** - Financial overview, transaction tracking
- **Team Management** - User roles and permissions
- **Settings** - Theme management and configuration

### 🛠️ Technical Features
- **Mock API** - MSW (Mock Service Worker) for development
- **State Management** - Redux Toolkit with RTK Query
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Theme switching support
- **TypeScript** - Full type safety
- **Accessibility** - WCAG compliant components

## 🚀 Deployment

### Automatic Deployment
- **Production**: Pushes to `main` branch automatically deploy
- **Staging**: Pushes to `staging` branch automatically deploy
- **Preview**: Pull requests automatically create preview deployments

### Manual Deployment
```bash
# Deploy to preview
npx vercel

# Deploy to staging
npx vercel --prod=false

# Deploy to production
npx vercel --prod=true
```

## 📚 Documentation

- **[README.md](../README.md)** - Project overview and setup
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Detailed deployment guide
- **[docs/README.md](./README.md)** - Comprehensive documentation
- **[docs/STATUS.md](./STATUS.md)** - Current project status
- **[docs/development/workflow.md](./development/workflow.md)** - Development workflow

## 🎯 Next Steps

### For Development
1. **Feature Development** - Create feature branches for new functionality
2. **Code Review** - Use pull requests for all changes
3. **Testing** - Test in preview environments before merging
4. **Documentation** - Update docs as you add features

### For Stakeholders
1. **Demo Environment** - Use staging branch for presentations
2. **Production Access** - Live at [prima-dashboard.vercel.app](https://prima-dashboard.vercel.app)
3. **Feedback** - Provide feedback through GitHub issues
4. **Monitoring** - Check Vercel dashboard for deployment status

## 🆘 Quick Troubleshooting

### Common Issues
```bash
# Build fails
pnpm install
pnpm build

# TypeScript errors
pnpm type-check

# Lint errors
pnpm lint:fix

# Development server issues
rm -rf .next
pnpm dev
```

### Getting Help
- **Documentation**: Check `/docs` directory
- **Issues**: Create GitHub issue
- **Deployment**: Check Vercel dashboard
- **Code**: Review existing patterns in codebase

---

**Last Updated**: September 19, 2025  
**Status**: ✅ Production Ready  
**Next Review**: October 19, 2025
