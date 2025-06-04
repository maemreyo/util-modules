# 🔗 Git Submodules Management Guide

This guide covers how to work with Git submodules in the util-modules monorepo.

## 📋 Overview

Each package in this monorepo is managed as a Git submodule, allowing:

- **Independent Development**: Each package has its own Git history
- **Flexible Versioning**: Packages can be versioned independently
- **Selective Updates**: Update only the packages you need
- **Clean Separation**: Clear boundaries between packages

## 🚀 Quick Start

### Initial Setup

```bash
# Clone with all submodules
git clone --recursive https://github.com/matthew-ngo/util-modules.git

# Or if already cloned
git submodule init
git submodule update
```

### Daily Workflow

```bash
# Check submodule status
git submodule status

# Update all submodules to latest
git submodule update --remote

# Update specific submodule
git submodule update --remote packages/ai-toolkit
```

## 🛠️ Working with Submodules

### Making Changes to a Package

```bash
# 1. Navigate to the package
cd packages/ai-toolkit

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make your changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push to package repository
git push origin feature/new-feature

# 6. Create PR in package repository
# ... create PR on GitHub ...

# 7. After PR is merged, update main branch
git checkout master
git pull origin master

# 8. Go back to root and update submodule reference
cd ../..
git add packages/ai-toolkit
git commit -m "chore: update ai-toolkit to include new feature"
```

### Updating Submodule References

```bash
# Update all submodules to their latest commits
git submodule update --remote

# Commit the updates
git add .
git commit -m "chore: update all submodules to latest"

# Push to main repository
git push origin master
```

### Working with Specific Commits

```bash
# Check out specific commit in submodule
cd packages/ai-toolkit
git checkout abc1234

# Update root repo to use this commit
cd ../..
git add packages/ai-toolkit
git commit -m "chore: pin ai-toolkit to commit abc1234"
```

## 🔄 Common Workflows

### Adding a New Submodule

```bash
# Add new submodule
git submodule add git@github.com:username/new-package.git packages/new-package

# Initialize and update
git submodule init
git submodule update

# Commit the addition
git add .gitmodules packages/new-package
git commit -m "feat: add new-package as submodule"
```

### Removing a Submodule

```bash
# Remove submodule entry from .gitmodules
git config -f .gitmodules --remove-section submodule.packages/old-package

# Remove submodule entry from .git/config
git config -f .git/config --remove-section submodule.packages/old-package

# Remove submodule files
git rm --cached packages/old-package
rm -rf packages/old-package

# Remove submodule directory from .git/modules
rm -rf .git/modules/packages/old-package

# Commit the removal
git add .gitmodules
git commit -m "chore: remove old-package submodule"
```

### Syncing with Team Changes

```bash
# Pull latest changes from main repo
git pull origin master

# Update submodules to match the commits referenced in main repo
git submodule update

# Or update to latest commits (if you want bleeding edge)
git submodule update --remote
```

## 🚨 Troubleshooting

### Submodule is in Detached HEAD State

```bash
cd packages/problematic-package
git checkout master  # or main
git pull origin master
cd ../..
git add packages/problematic-package
git commit -m "chore: fix detached HEAD in problematic-package"
```

### Submodule Directory is Empty

```bash
git submodule init
git submodule update
```

### Merge Conflicts in Submodule References

```bash
# Check which commits are conflicting
git status

# Choose the correct commit hash
git add packages/conflicted-package
git commit -m "resolve: submodule conflict"
```

### Reset Submodule to Clean State

```bash
# Reset specific submodule
git submodule deinit packages/problematic-package
git submodule init packages/problematic-package
git submodule update packages/problematic-package

# Reset all submodules
git submodule deinit --all
git submodule init
git submodule update
```

## 📊 Monitoring Submodules

### Check Status

```bash
# Show submodule status
git submodule status

# Show submodule summary
git submodule summary

# Show which submodules have changes
git submodule foreach 'git status --porcelain'
```

### Useful Aliases

Add these to your `.gitconfig`:

```ini
[alias]
    # Submodule shortcuts
    sub-update = submodule update --remote
    sub-status = submodule status
    sub-summary = submodule summary
    sub-foreach = submodule foreach

    # Update all submodules and commit
    sub-sync = !git submodule update --remote && git add . && git commit -m "chore: sync all submodules"
```

## 🎯 Best Practices

### Development

1. **Always work on branches** in submodules, never directly on master
2. **Create PRs** for submodule changes before updating main repo
3. **Test thoroughly** before updating submodule references
4. **Use semantic commits** for both submodule and main repo changes

### Collaboration

1. **Communicate** submodule updates to team members
2. **Document** breaking changes in submodule updates
3. **Use tags** for stable submodule versions
4. **Keep submodules** up to date but not bleeding edge in production

### CI/CD

1. **Always clone with** `--recursive` in CI
2. **Pin submodule commits** for stable releases
3. **Test submodule updates** in staging before production
4. **Automate submodule** health checks

## 🔗 Package Repositories

| Package           | Repository                                                                  | Description                    |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------ |
| content-extractor | [maemreyo/content-extractor](https://github.com/maemreyo/content-extractor) | Intelligent content extraction |
| ai-toolkit        | [maemreyo/ai-toolkit](https://github.com/maemreyo/ai-toolkit)               | Multi-provider AI toolkit      |
| analysis          | [maemreyo/analysis-toolkit](https://github.com/maemreyo/analysis-toolkit)   | Advanced analysis tools        |
| storage           | [maemreyo/chrome-storage](https://github.com/maemreyo/chrome-storage)       | Chrome storage utilities       |

## 📞 Support

If you encounter issues with submodules:

1. Check this guide first
2. Search existing
   [GitHub Issues](https://github.com/matthew-ngo/util-modules/issues)
3. Create a new issue with detailed information
4. Include output of `git submodule status` and `git status`

---

**Remember**: Submodules are powerful but require discipline. Always communicate
changes and test thoroughly! 🚀
