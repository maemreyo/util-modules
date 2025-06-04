#!/bin/bash
# Quick setup script for util-modules monorepo

set -e # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_command() {
    if ! command -v $1 &>/dev/null; then
        print_error "$1 is not installed"
        return 1
    else
        print_success "$1 is installed"
        return 0
    fi
}

# Main setup
print_header "🚀 Util-Modules Monorepo Quick Setup"

# Step 1: Check prerequisites
print_header "Step 1: Checking Prerequisites"

# Check Node.js
if check_command node; then
    NODE_VERSION=$(node -v)
    print_info "Node version: $NODE_VERSION"

    # Check if Node version is >= 18
    REQUIRED_NODE_VERSION=18
    CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

    if [ "$CURRENT_NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
        print_error "Node.js version must be >= $REQUIRED_NODE_VERSION"
        exit 1
    fi
else
    print_error "Please install Node.js >= 18"
    exit 1
fi

# Check Git
if ! check_command git; then
    print_error "Please install Git"
    exit 1
fi

# Check/Install pnpm
if ! check_command pnpm; then
    print_info "Installing pnpm..."
    npm install -g pnpm@8
    print_success "pnpm installed"
fi

# Step 2: Clone or update repository
print_header "Step 2: Repository Setup"

if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the repository root."
    exit 1
fi

# Step 3: Install dependencies
print_header "Step 3: Installing Dependencies"

print_info "Installing all dependencies with pnpm..."
pnpm install

print_success "Dependencies installed"

# Step 4: Initial build
print_header "Step 4: Building All Packages"

print_info "Building all packages..."
pnpm build

print_success "All packages built successfully"

# Step 5: Run initial tests
print_header "Step 5: Running Tests"

print_info "Running tests..."
if pnpm test; then
    print_success "All tests passed"
else
    print_error "Some tests failed, but continuing setup..."
fi

# Step 6: Setup Git hooks
print_header "Step 6: Setting up Git Hooks"

if [ -d ".husky" ]; then
    print_info "Setting up Husky hooks..."
    pnpm husky install
    print_success "Git hooks configured"
else
    print_info "Husky not configured, skipping..."
fi

# Step 7: Create local config files
print_header "Step 7: Creating Local Configuration"

# Create .env.local if needed
if [ ! -f ".env.local" ]; then
    cat >.env.local <<EOF
# Local environment variables
NODE_ENV=development
EOF
    print_success "Created .env.local"
fi

# Step 8: Configure npm for publishing
print_header "Step 8: NPM Configuration"

print_info "Checking npm authentication..."
if npm whoami &>/dev/null; then
    NPM_USER=$(npm whoami)
    print_success "Logged in to npm as: $NPM_USER"
else
    print_info "Not logged in to npm. Run 'npm login' when ready to publish."
fi

# Step 9: Final setup
print_header "Step 9: Final Setup"

# Create useful directories
mkdir -p .changeset 2>/dev/null || true
mkdir -p docs/api 2>/dev/null || true

print_success "Directory structure verified"

# Step 10: Quick health check
print_header "Step 10: Quick Health Check"

print_info "Running quick health check..."

# Check each package exists
PACKAGES=("storage" "ai-toolkit" "content-extractor" "analysis")
ALL_GOOD=true

for pkg in "${PACKAGES[@]}"; do
    if [ -d "packages/$pkg" ] && [ -f "packages/$pkg/package.json" ]; then
        print_success "Package @matthew.ngo/$pkg is ready"
    else
        print_error "Package @matthew.ngo/$pkg is missing"
        ALL_GOOD=false
    fi
done

# Summary
print_header "✨ Setup Complete!"

echo "Your monorepo is ready! Here are some useful commands:"
echo ""
echo "  Development:"
echo "    pnpm dev              # Start development mode"
echo "    pnpm test             # Run all tests"
echo "    pnpm lint             # Lint all code"
echo "    pnpm build            # Build all packages"
echo ""
echo "  Package Management:"
echo "    pnpm --filter @matthew.ngo/storage dev    # Work on specific package"
echo "    pnpm affected:build                       # Build only changed packages"
echo ""
echo "  Release:"
echo "    pnpm changeset        # Create a changeset"
echo "    pnpm release          # Release packages"
echo ""
echo "  Utilities:"
echo "    pnpm audit            # Check package health"
echo "    pnpm graph            # View dependency graph"
echo ""

if [ "$ALL_GOOD" = true ]; then
    print_success "All systems operational! 🚀"
else
    print_error "Some issues detected. Please check the errors above."
fi

# Optional: Start dev server
echo ""
read -p "Would you like to start the development server? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development server..."
    pnpm dev
fi
