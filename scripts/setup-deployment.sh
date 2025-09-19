#!/bin/bash

# PrimaClient Dashboard Deployment Setup Script
# Run this script to set up professional deployment workflows

set -e

echo "🚀 Setting up PrimaClient Dashboard deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install Vercel CLI
install_vercel_cli() {
    print_status "Installing Vercel CLI..."
    
    if command -v vercel &> /dev/null; then
        print_success "Vercel CLI is already installed"
    else
        npm install -g vercel
        print_success "Vercel CLI installed"
    fi
}

# Set up Vercel project
setup_vercel() {
    print_status "Setting up Vercel project..."
    
    if [ -f ".vercel/project.json" ]; then
        print_warning "Vercel project already linked"
    else
        print_status "Please follow the Vercel setup prompts..."
        vercel link
        print_success "Vercel project linked"
    fi
}

# Create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ -f ".env.local" ]; then
        print_warning ".env.local already exists"
    else
        cat > .env.local << EOF
# PrimaClient Dashboard Environment Variables
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_DEBUG=true
EOF
        print_success "Created .env.local file"
    fi
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Run quality checks
run_quality_checks() {
    print_status "Running quality checks..."
    
    print_status "TypeScript check..."
    npm run type-check
    
    print_status "ESLint check..."
    npm run lint
    
    print_status "Prettier check..."
    npm run format
    
    print_status "Build test..."
    npm run build
    
    print_success "All quality checks passed"
}

# Set up Git hooks (optional)
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run quality checks before commit
npm run type-check
npm run lint
npm run format
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks set up"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup complete! Here's what to do next:"
    echo ""
    echo "1. 📝 Configure GitHub Secrets:"
    echo "   - Go to your GitHub repo → Settings → Secrets and variables → Actions"
    echo "   - Add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
    echo ""
    echo "2. 🌿 Set up Branch Protection:"
    echo "   - Go to GitHub repo → Settings → Branches"
    echo "   - Add protection rules for 'main' and 'develop' branches"
    echo ""
    echo "3. 🚀 Deploy to staging:"
    echo "   - Create a 'develop' branch: git checkout -b develop"
    echo "   - Push: git push origin develop"
    echo "   - This will trigger staging deployment"
    echo ""
    echo "4. 📊 Monitor deployments:"
    echo "   - Check GitHub Actions tab for deployment status"
    echo "   - Check Vercel dashboard for deployment URLs"
    echo ""
    echo "5. 🔧 Useful commands:"
    echo "   - npm run deploy:staging    # Deploy to staging"
    echo "   - npm run deploy:production # Deploy to production"
    echo "   - npm run deploy:rollback   # Rollback deployment"
    echo "   - npm run deploy:logs       # View deployment logs"
    echo ""
    echo "📚 Read DEPLOYMENT_GUIDE.md for detailed information"
}

# Main execution
main() {
    echo "🏗️  PrimaClient Dashboard Deployment Setup"
    echo "=========================================="
    echo ""
    
    check_dependencies
    install_vercel_cli
    setup_vercel
    create_env_file
    install_dependencies
    run_quality_checks
    setup_git_hooks
    show_next_steps
    
    print_success "Setup completed successfully! 🎉"
}

# Run main function
main "$@"
