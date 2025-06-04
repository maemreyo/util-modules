#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function checkGitStatus(verbose = false) {
  console.log('🔍 Checking Git Status...\n');

  const checks = {
    hasUncommittedChanges: false,
    hasUntrackedFiles: false,
    hasUnpushedCommits: false,
    currentBranch: '',
    isClean: true,
    details: {},
  };

  try {
    // 1. Check current branch
    checks.currentBranch = execSync('git branch --show-current', {
      encoding: 'utf8',
    }).trim();
    console.log(`📍 Current branch: ${checks.currentBranch}`);

    // 2. Check uncommitted changes
    try {
      execSync('git diff --quiet', { stdio: 'pipe' });
      execSync('git diff --staged --quiet', { stdio: 'pipe' });
      console.log(`${colors.green}✓${colors.reset} No uncommitted changes`);
    } catch (e) {
      checks.hasUncommittedChanges = true;
      checks.isClean = false;
      console.log(`${colors.red}✗${colors.reset} Uncommitted changes found`);

      if (verbose) {
        // Show which files have changes
        const changes = execSync('git diff --name-status', {
          encoding: 'utf8',
        });
        const staged = execSync('git diff --staged --name-status', {
          encoding: 'utf8',
        });

        if (changes) {
          console.log('\n  Unstaged changes:');
          console.log(
            changes
              .split('\n')
              .map((line) => '    ' + line)
              .join('\n')
          );
        }
        if (staged) {
          console.log('\n  Staged changes:');
          console.log(
            staged
              .split('\n')
              .map((line) => '    ' + line)
              .join('\n')
          );
        }
      }
    }

    // 3. Check untracked files
    const untracked = execSync('git ls-files --others --exclude-standard', {
      encoding: 'utf8',
    }).trim();

    if (untracked) {
      checks.hasUntrackedFiles = true;
      checks.details.untrackedFiles = untracked.split('\n');
      console.log(
        `${colors.yellow}⚠${colors.reset}  ${checks.details.untrackedFiles.length} untracked files`
      );

      if (verbose) {
        console.log('\n  Untracked files:');
        checks.details.untrackedFiles.forEach((file) => {
          console.log(`    ${file}`);
        });
      }
    } else {
      console.log(`${colors.green}✓${colors.reset} No untracked files`);
    }

    // 4. Check unpushed commits
    try {
      const unpushed = execSync(
        `git log origin/${checks.currentBranch}..HEAD --oneline`,
        {
          encoding: 'utf8',
        }
      ).trim();

      if (unpushed) {
        const commits = unpushed.split('\n');
        checks.hasUnpushedCommits = true;
        checks.details.unpushedCommits = commits;
        console.log(
          `${colors.yellow}⚠${colors.reset}  ${commits.length} unpushed commits`
        );

        if (verbose) {
          console.log('\n  Unpushed commits:');
          commits.forEach((commit) => {
            console.log(`    ${commit}`);
          });
        }
      } else {
        console.log(`${colors.green}✓${colors.reset} All commits pushed`);
      }
    } catch (e) {
      console.log(
        `${colors.yellow}⚠${colors.reset}  Could not check unpushed commits (no upstream branch?)`
      );
    }

    // 5. Check if we're on a release-friendly branch
    const releaseBranches = ['main', 'master', 'develop', 'release'];
    const isReleaseBranch = releaseBranches.some(
      (branch) =>
        checks.currentBranch === branch ||
        checks.currentBranch.startsWith('release/')
    );

    if (!isReleaseBranch) {
      console.log(
        `${colors.yellow}⚠${colors.reset}  Not on a release branch (current: ${checks.currentBranch})`
      );
      checks.isClean = false;
    } else {
      console.log(`${colors.green}✓${colors.reset} On release branch`);
    }

    // 6. Summary
    console.log('\n📊 Summary:');
    if (checks.isClean && !checks.hasUncommittedChanges) {
      console.log(
        `${colors.green}✅ Repository is ready for release!${colors.reset}`
      );
    } else {
      console.log(
        `${colors.red}❌ Repository is NOT ready for release${colors.reset}`
      );
      console.log('\nRequired actions:');

      if (checks.hasUncommittedChanges) {
        console.log('  1. Commit or stash your changes:');
        console.log('     git add . && git commit -m "your message"');
        console.log('     OR');
        console.log('     git stash');
      }

      if (checks.hasUntrackedFiles) {
        console.log('  2. Handle untracked files:');
        console.log('     git add <files>  # to track them');
        console.log('     OR');
        console.log('     Add to .gitignore if they should be ignored');
      }

      if (!isReleaseBranch) {
        console.log('  3. Switch to a release branch:');
        console.log('     git checkout main');
      }
    }

    return checks;
  } catch (error) {
    console.error(
      `${colors.red}Error checking git status:${colors.reset}`,
      error.message
    );
    return null;
  }
}

// Kiểm tra specific cho monorepo packages
function checkPackageChanges(packageName) {
  console.log(`\n📦 Checking changes for ${packageName}...`);

  try {
    // Check if package has uncommitted changes
    const packagePath = packageName.replace('@matthew.ngo/', 'packages/');
    const changes = execSync(`git diff --name-only ${packagePath}`, {
      encoding: 'utf8',
    }).trim();

    const stagedChanges = execSync(
      `git diff --staged --name-only ${packagePath}`,
      {
        encoding: 'utf8',
      }
    ).trim();

    if (changes || stagedChanges) {
      console.log(
        `${colors.yellow}⚠${colors.reset}  Package has uncommitted changes`
      );
      if (changes) {
        console.log('\n  Modified files:');
        changes.split('\n').forEach((file) => console.log(`    ${file}`));
      }
      return false;
    } else {
      console.log(
        `${colors.green}✓${colors.reset} Package has no uncommitted changes`
      );
      return true;
    }
  } catch (error) {
    console.error('Error checking package changes:', error.message);
    return false;
  }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const verbose = args.includes('-v') || args.includes('--verbose');
  const packageName = args.find((arg) => arg.startsWith('@matthew.ngo/'));

  const status = checkGitStatus(verbose);

  if (packageName) {
    checkPackageChanges(packageName);
  }

  // Exit with appropriate code
  if (status && status.isClean && !status.hasUncommittedChanges) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

export { checkGitStatus, checkPackageChanges };
