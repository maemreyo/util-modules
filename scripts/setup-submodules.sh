#!/bin/bash

# 🚀 Submodule Setup Script
# Quick setup for new developers

set -e

echo "🔗 Setting up Git Submodules for util-modules"
echo "=============================================="

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f ".gitmodules" ]; then
    print_error "This script must be run from the root of the util-modules repository"
    exit 1
fi

# Check if git is available
if ! command -v git &>/dev/null; then
    print_error "Git is not installed or not in PATH"
    exit 1
fi

# Check if pnpm is available
if ! command -v pnpm &>/dev/null; then
    print_error "pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

print_status "Checking current submodule status..."
git submodule status

print_status "Initializing submodules..."
git submodule init

print_status "Updating submodules to latest commits..."
git submodule update

print_status "Checking submodule health..."
if git submodule status | grep -q '^-'; then
    print_warning "Some submodules are not properly initialized"
    print_status "Attempting to fix..."
    git submodule update --init --recursive
fi

print_status "Installing dependencies..."
pnpm install

print_status "Running health check..."
if pnpm submodules:check; then
    print_success "All submodules are healthy!"
else
    print_warning "Some submodules have uncommitted changes"
fi

print_status "Building all packages..."
if pnpm build; then
    print_success "All packages built successfully!"
else
    print_error "Build failed. Please check the output above."
    exit 1
fi

print_status "Running tests..."
if pnpm test; then
    print_success "All tests passed!"
else
    print_warning "Some tests failed. Please check the output above."
fi

echo ""
print_success "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  • Read the SUBMODULE_GUIDE.md for detailed workflow"
echo "  • Use 'pnpm submodules:status' to check submodule status"
echo "  • Use 'pnpm submodules:update' to update submodules"
echo "  • Use 'pnpm submodules:sync' to sync and commit updates"
echo ""
echo "🔗 Submodule repositories:"
echo "  • content-extractor: https://github.com/maemreyo/content-extractor"
echo "  • ai-toolkit: https://github.com/maemreyo/ai-toolkit"
echo "  • analysis: https://github.com/maemreyo/analysis-toolkit"
echo "  • storage: https://github.com/maemreyo/chrome-storage"
echo ""
print_success "Happy coding! 🚀"
