# Development Workflow

Comprehensive guide to the development process, Git conventions, and project workflow for the PRIMA Partner Dashboard.

## 🎯 Workflow Overview

The PRIMA Partner Dashboard follows a **sequential RFC-based development workflow** where each feature is implemented according to a strict order defined in the RFC framework.

### Core Principles

1. **Sequential Implementation**: Complete RFC N before starting RFC N+1
2. **Quality First**: Comprehensive testing before progression
3. **Design System Preservation**: Maintain OKLCH color tokens and design consistency
4. **Integration Testing**: Each RFC validates against all previous work

## 📋 RFC-Based Development Process

### Current Implementation Status

Check the [RFC Status Table](../RFCs/RFCS.md#rfc-status-tracking) to determine:

- Which RFC is currently ready for implementation
- Dependencies that must be completed first
- Expected timeline and complexity

### RFC Implementation Workflow

#### 1. Pre-Implementation Phase

```bash
# 1. Check RFC status and dependencies
cat docs/RFCs/RFCS.md | grep "Status"

# 2. Create RFC branch
git checkout main
git pull origin main
git checkout -b rfc/001-authentication  # Use RFC number and brief description

# 3. Read RFC specification thoroughly
open docs/RFCs/RFC-001-Authentication-Base-Infrastructure.md

# 4. Review implementation prompt

open docs/RFCs/implementation-prompt-RFC-001.md
```

#### 2. Implementation Phase

```bash
# 1. Set up development environment
pnpm install
cp .env.example .env.local
pnpm dev

# 2. Follow RFC specification exactly
# - Implement all required features
# - Follow established patterns from previous RFCs
# - Maintain design system integrity
# - Write comprehensive tests

# 3. Regular commits with RFC prefix
git add .
git commit -m "rfc-001: feat(auth): implement login page with role switching"

git commit -m "rfc-001: feat(auth): add user context provider"
git commit -m "rfc-001: test(auth): add comprehensive authentication tests"
```

#### 3. Quality Assurance Phase

```bash
# 1. Run full test suite
pnpm test
pnpm test:e2e

# 2. Check code quality
pnpm lint
pnpm type-check
pnpm build

# 3. Verify RFC completion
# - All acceptance criteria met

# - All tests passing
# - Performance benchmarks maintained
# - Accessibility compliance verified
```

#### 4. Integration Phase

```bash
# 1. Test integration with previous RFCs
pnpm test:integration

# 2. Manual testing of all demo scenarios
pnpm dev
# Test each user journey manually

# 3. Create pull request

git push origin rfc/001-authentication
# Create PR with comprehensive description
```

## 🌊 Git Workflow

### Branch Strategy

```
main                           # Production-ready code
├── staging                    # Demo and stakeholder preview environment
├── develop                    # Integration branch for completed RFCs
├── rfc/001-authentication     # RFC implementation branches
├── rfc/002-data-layer        
├── rfc/003-layout-shell
├── hotfix/critical-fix       # Emergency fixes
└── release/v1.0.0            # Release preparation
```

#### Branch Purposes

- **`main`**: Production-ready code, final deliverable
- **`staging`**: Stable demo environment for stakeholder presentations  
- **`develop`**: Integration of completed RFCs, continuous testing
- **`rfc/*`**: Individual RFC implementation branches
- **`release/*`**: Release preparation and final testing
- **`hotfix/*`**: Critical fixes that need immediate deployment

### Branch Naming Conventions

```bash
# RFC implementation branches
rfc/001-authentication
rfc/002-data-layer
rfc/005-booking-management

# Feature branches (for non-RFC work)
feature/update-dependencies
feature/improve-documentation

# Bug fixes

fix/booking-status-update
fix/venue-selector-crash

# Hotfixes
hotfix/security-vulnerability
hotfix/production-crash
```

### Staging Branch Workflow

The `staging` branch serves as a stable demo environment for stakeholder presentations and integration testing.

#### Staging Deployment Strategy

```bash
# 1. Complete RFC implementation on feature branch
git checkout rfc/004-overview-dashboard
# ... implement RFC-004 ...
git push origin rfc/004-overview-dashboard

# 2. Create PR to develop branch first
# Merge to develop after review and testing

# 3. Deploy completed RFCs to staging for demo readiness
git checkout staging
git pull origin staging
git merge origin/develop  # Merge stable, tested RFCs
git push origin staging

# 4. Staging automatically deploys to demo environment
# Stakeholders can preview completed functionality
```

#### Staging Update Schedule

- **After each completed RFC**: Merge to staging for stakeholder preview
- **Before demos**: Ensure staging has all demo-ready features  
- **Weekly updates**: Regular staging updates with completed RFCs
- **Hotfix deployments**: Critical fixes pushed directly to staging

#### Staging Environment Configuration

```bash
# Environment variables for staging
NEXT_PUBLIC_APP_URL=https://prima-staging.vercel.app
NEXT_PUBLIC_MSW_ENABLED=true  # Enable demo data
NODE_ENV=production
STAGING_ENVIRONMENT=true
DEMO_MODE=true  # Enables demo-specific features
```

#### Demo Readiness Checklist

Before merging to staging:

- [ ] RFC fully implemented and tested
- [ ] All demo scenarios working
- [ ] Performance meets targets
- [ ] Mobile responsiveness verified
- [ ] Realistic demo data loaded
- [ ] No console errors or warnings

### Commit Message Format

```bash
# RFC commits (preferred during RFC implementation)
rfc-001: feat(auth): implement login page with role switching
rfc-001: feat(auth): add protected route component
rfc-001: test(auth): add authentication context tests
rfc-001: docs(auth): update implementation notes

# Staging deployment commits
staging: deploy rfc-004 overview dashboard for demo
staging: hotfix venue selector crash  
staging: update demo data for stakeholder presentation

# Standard commits (for non-RFC work)
feat(overview): add KPI drill-through navigation
fix(bookings): resolve status update race condition
docs(api): update booking endpoints documentation
test(promoters): add leaderboard component tests
refactor(state): optimize RTK Query cache configuration
style(ui): update button variant styles
perf(table): implement virtual scrolling for large datasets
```

### Commit Types

- **feat**: New feature implementation

- **fix**: Bug fixes
- **docs**: Documentation changes
- **test**: Test additions or modifications
- **refactor**: Code refactoring without functional changes
- **style**: Code style/formatting changes
- **perf**: Performance improvements
- **chore**: Build process, dependency updates, etc.

## 🔄 Pull Request Process

### PR Creation Checklist

Before creating a pull request:

```bash
# 1. Ensure branch is up to date
git checkout main
git pull origin main
git checkout rfc/001-authentication
git rebase main


# 2. Run comprehensive testing
pnpm test
pnpm lint
pnpm type-check
pnpm build

# 3. Verify RFC completion
# Check all acceptance criteria in RFC specification
```

### PR Template

```markdown
## RFC Implementation: [RFC-001] Authentication & Base Infrastructure

### Summary
Brief description of what this PR implements and how it relates to the RFC specification.

### RFC Compliance Checklist
- [ ] All RFC requirements implemented
- [ ] All acceptance criteria met
- [ ] Integration with previous RFCs verified
- [ ] Design system integrity maintained
- [ ] Performance benchmarks maintained

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] E2E tests for new user flows
- [ ] Manual testing completed

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] ESLint and Prettier passing
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Mobile responsiveness verified

### Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes documented with migration guide

### Demo Scenarios
List which demo scenarios are now functional after this PR:
- [ ] Multi-Venue Portfolio Management
- [ ] Revenue Control
- [ ] Promoter Performance

- [ ] Financial Operations
- [ ] Loss Management

### Screenshots
Include screenshots for UI changes, before/after comparisons.

### Implementation Notes
Any notable implementation decisions, trade-offs, or deviations from the RFC specification.
```

### Review Process

#### Reviewer Checklist

- [ ] **RFC Compliance**: All requirements from RFC specification met
- [ ] **Code Quality**: Follows established patterns and conventions
- [ ] **Testing**: Comprehensive test coverage with meaningful tests
- [ ] **Performance**: No performance regressions introduced
- [ ] **Accessibility**: WCAG 2.1 AA compliance maintained
- [ ] **Design System**: OKLCH tokens preserved, no unauthorized changes

- [ ] **Integration**: Works correctly with all previous RFC implementations
- [ ] **Documentation**: Code properly documented, README updated if needed

#### Approval Criteria

A PR can only be approved when:

1. All automated checks pass (CI/CD)
2. All reviewer checklist items verified
3. All RFC acceptance criteria met
4. Manual testing confirms functionality
5. No breaking changes to existing features

## 🚀 Continuous Integration & Deployment

### Automated Checks

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop, staging]
  push:
    branches: [main, staging, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      

      - name: Type check

        run: pnpm type-check
      
      - name: Lint
        run: pnpm lint
      
      - name: Unit tests
        run: pnpm test
      
      - name: Build
        run: pnpm build

      
      - name: E2E tests
        run: pnpm test:e2e
```

### Staging Deployment Pipeline

```yaml
# .github/workflows/staging-deploy.yml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build for staging
        run: pnpm build
        env:
          NEXT_PUBLIC_APP_URL: https://prima-staging.vercel.app
          NEXT_PUBLIC_MSW_ENABLED: true
          STAGING_ENVIRONMENT: true
          DEMO_MODE: true
      
      - name: Deploy to Vercel Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod --env STAGING_ENVIRONMENT=true'
          
      - name: Run staging health check
        run: |
          sleep 30  # Wait for deployment
          curl -f https://prima-staging.vercel.app/api/health || exit 1
          
      - name: Notify stakeholders
        if: success()
        run: |
          echo "Staging deployment successful: https://prima-staging.vercel.app"
          # Add Slack/Teams notification here
```

### Quality Gates

Before any merge to main:

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage above 85%
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] Build successful
- [ ] Performance budget maintained

## 🔧 Development Environment Setup

### Required Tools

```bash
# Node.js version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Package manager
npm install -g pnpm@latest

# Git configuration
git config --global user.name "Your Name"

git config --global user.email "your.email@example.com"
```

### Project Setup

```bash
# Clone and setup
git clone <repository-url>
cd prima-dashboard-1.0

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Verify setup

pnpm dev
```

### VS Code Configuration

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}

```

### Recommended Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",

    "ms-playwright.playwright",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

## 📊 Performance Monitoring

### Development Metrics

```bash
# Bundle analysis
pnpm build
pnpm analyze

# Performance testing
pnpm lighthouse

# Memory profiling
node --inspect-brk node_modules/.bin/next dev
```

### Performance Budgets

- **Initial Bundle**: < 500KB compressed
- **Route Chunks**: < 200KB compressed
- **Time to Interactive**: < 3 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1

## 🐛 Debugging Workflow

### Common Issues and Solutions

#### Build Failures

```bash
# Clear all caches
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build

# Check for TypeScript errors
pnpm type-check

# Verify import paths
pnpm lint --fix
```

#### Test Failures

```bash
# Run tests in watch mode
pnpm test --watch

# Debug specific test
pnpm test --debug booking-management.test.tsx

# Update test snapshots
pnpm test --updateSnapshot
```

#### Development Server Issues

```bash
# Check port conflicts

lsof -ti:3000

# Clear Next.js cache
rm -rf .next

# Reset node modules
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📈 Release Process

### Version Management

```bash
# Update version (follows semantic versioning)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0

npm version major  # 1.0.0 -> 2.0.0

# Create release branch
git checkout -b release/v1.1.0

# Prepare release
pnpm build

pnpm test
```

### Pre-Release Checklist

- [ ] All RFCs implemented and tested
- [ ] All demo scenarios working

- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Cross-browser testing completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

## 🎯 Best Practices

### Code Organization

- Follow RFC specifications exactly
- Maintain consistent file and folder structure
- Use TypeScript strict mode
- Write self-documenting code with clear names
- Keep components small and focused

### Testing Strategy

- Write tests first for critical functionality
- Test user interactions, not implementation details
- Use realistic test data
- Mock external dependencies consistently
- Maintain high test coverage (85%+)

### Performance Optimization

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Minimize bundle size with proper imports
- Monitor Core Web Vitals

### Security Considerations

- Never commit secrets or API keys
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP security guidelines

## 🎪 Staging Branch Benefits

### For Stakeholders

- **Early Preview**: See completed RFCs in action before final release
- **Demo Environment**: Stable environment for stakeholder presentations  
- **Feedback Loop**: Provide feedback on functionality before production
- **Progress Tracking**: Visual confirmation of RFC completion status

### For Development Team

- **Integration Testing**: Test RFC combinations in production-like environment
- **Performance Validation**: Monitor real-world performance metrics
- **Demo Preparation**: Ensure demo scenarios work flawlessly
- **Risk Reduction**: Catch integration issues before main branch

### For Project Management  

- **Release Planning**: Preview release readiness and scope
- **Quality Assurance**: Additional testing layer before production
- **Stakeholder Communication**: Clear demonstration of progress
- **Risk Management**: Early detection of issues

---

This workflow, including the staging branch strategy, ensures systematic, quality-driven development while maintaining the RFC-based implementation approach and design system integrity.
