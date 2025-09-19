# 🌿 Branch Protection Rules

## Recommended GitHub Branch Protection Settings

### **Main Branch (`main`)**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require conversation resolution before merging

**Required Status Checks:**
- `quality-checks` (TypeScript, ESLint, Prettier, Build)
- `deploy-production` (Production deployment)

### **Develop Branch (`develop`)**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Allow force pushes (for hotfixes)

**Required Status Checks:**
- `quality-checks` (TypeScript, ESLint, Prettier, Build)
- `deploy-staging` (Staging deployment)

### **Feature Branches**
- No protection rules (free development)
- Must be merged via Pull Request
- Should be deleted after merging

## 🔧 How to Set Up Branch Protection

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Click **Add rule**
4. Configure the rules above for each branch
5. Save changes

## 📋 Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## 📝 Description
Brief description of changes

## 🧪 Testing
- [ ] Local testing completed
- [ ] Staging deployment tested
- [ ] No breaking changes

## 📸 Screenshots
Add screenshots if UI changes

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🚨 Emergency Procedures

### **Hotfix Process:**
1. Create `hotfix/` branch from `main`
2. Make minimal fix
3. Test locally
4. Create PR to `main` with "HOTFIX:" prefix
5. Get expedited review
6. Merge and deploy immediately
7. Cherry-pick to `develop`

### **Rollback Process:**
1. Identify bad commit
2. Create revert PR
3. Deploy immediately
4. Post-mortem analysis
