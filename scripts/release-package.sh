#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Functions
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }

# Check if package name provided
if [ -z "$1" ]; then
    echo "Usage: ./release-package.sh <package-name> [version-type]"
    echo "Example: ./release-package.sh @matthew.ngo/ai-toolkit patch"
    echo ""
    echo "Package names:"
    echo "  @matthew.ngo/storage"
    echo "  @matthew.ngo/ai-toolkit"
    echo "  @matthew.ngo/content-extractor"
    echo "  @matthew.ngo/analysis"
    echo ""
    echo "Version types: patch | minor | major"
    exit 1
fi

PACKAGE_NAME=$1
VERSION_TYPE=${2:-patch}

echo "🚀 Releasing ${PACKAGE_NAME} (${VERSION_TYPE})"
echo ""

# Step 1: Check git status (but more lenient for monorepo)
print_info "Checking git status..."
if git diff --quiet && git diff --staged --quiet; then
    print_success "No uncommitted changes"
else
    print_error "You have uncommitted changes!"
    echo "Please commit or stash your changes first."
    exit 1
fi

# Step 2: Pull latest changes
print_info "Pulling latest changes..."
git pull origin main --rebase
print_success "Up to date with origin/main"

# Step 3: Run tests for the specific package
print_info "Running tests for ${PACKAGE_NAME}..."
if pnpm --filter "${PACKAGE_NAME}" test; then
    print_success "Tests passed"
else
    print_error "Tests failed!"
    exit 1
fi

# Step 4: Build the package
print_info "Building ${PACKAGE_NAME}..."
if pnpm --filter "${PACKAGE_NAME}" build; then
    print_success "Build successful"
else
    print_error "Build failed!"
    exit 1
fi

# Step 5: Create changeset
print_info "Creating changeset..."
cat >.changeset/release-$(date +%s).md <<EOF
---
"${PACKAGE_NAME}": ${VERSION_TYPE}
---

Release ${VERSION_TYPE} version
EOF
print_success "Changeset created"

# Step 6: Version the package
print_info "Versioning package..."
pnpm changeset version
print_success "Package versioned"

# Step 7: Show what will be released
echo ""
echo "📋 Release Summary:"
echo "-------------------"
CURRENT_VERSION=$(node -p "require('./packages/${PACKAGE_NAME#@matthew.ngo/}/package.json').version")
echo "Package: ${PACKAGE_NAME}"
echo "New Version: ${CURRENT_VERSION}"
echo ""

# Step 8: Confirm release
read -p "Do you want to continue with the release? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Release cancelled"
    # Clean up changeset
    rm .changeset/release-*.md
    git checkout -- .
    exit 0
fi

# Step 9: Commit version changes
print_info "Committing version changes..."
git add .
git commit -m "chore: release ${PACKAGE_NAME}@${CURRENT_VERSION}"
print_success "Changes committed"

# Step 10: Publish to npm
print_info "Publishing to npm..."
if pnpm changeset publish; then
    print_success "Published to npm!"
else
    print_error "Publishing failed!"
    echo "You may need to run: npm login"
    exit 1
fi

# Step 11: Push changes and tags
print_info "Pushing changes and tags..."
git push --follow-tags
print_success "Pushed to git"

# Done!
echo ""
echo "🎉 Release completed successfully!"
echo ""
echo "📦 ${PACKAGE_NAME}@${CURRENT_VERSION} is now live on npm!"
echo "🔗 https://www.npmjs.com/package/${PACKAGE_NAME}"
echo ""
echo "Next steps:"
echo "  - Check the package on npm"
echo "  - Update any dependent projects"
echo "  - Announce the release if needed"
