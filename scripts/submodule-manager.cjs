#!/usr/bin/env node

/**
 * Submodule Manager Script
 *
 * Provides utilities for managing Git submodules in the monorepo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SubmoduleManager {
  constructor() {
    this.rootDir = process.cwd();
    this.packagesDir = path.join(this.rootDir, 'packages');
  }

  /**
   * Execute shell command and return output
   */
  exec(command, options = {}) {
    try {
      return execSync(command, {
        encoding: 'utf8',
        stdio: 'pipe',
        ...options,
      }).trim();
    } catch (error) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Get submodule status
   */
  getSubmoduleStatus() {
    console.log('📊 Checking submodule status...\n');

    const status = this.exec('git submodule status');
    const lines = status.split('\n').filter((line) => line.trim());

    const submodules = lines
      .map((line) => {
        const match = line.match(/^(.)([a-f0-9]+)\s+(.+?)(?:\s+\((.+)\))?$/);
        if (!match) return null;

        const [, prefix, commit, path, branch] = match;
        return {
          status:
            prefix === ' '
              ? 'clean'
              : prefix === '+'
                ? 'modified'
                : 'uninitialized',
          commit: commit.substring(0, 8),
          path,
          branch: branch || 'detached',
        };
      })
      .filter(Boolean);

    return submodules;
  }

  /**
   * Display submodule status in a nice format
   */
  showStatus() {
    const submodules = this.getSubmoduleStatus();

    console.log(
      '┌─────────────────────────────────────────────────────────────┐'
    );
    console.log(
      '│                    SUBMODULE STATUS                         │'
    );
    console.log(
      '├─────────────────────────────────────────────────────────────┤'
    );

    submodules.forEach((sub) => {
      const statusIcon =
        sub.status === 'clean' ? '✅' : sub.status === 'modified' ? '🔄' : '❌';
      const name = path.basename(sub.path);

      console.log(
        `│ ${statusIcon} ${name.padEnd(20)} │ ${sub.commit} │ ${sub.branch.padEnd(15)} │`
      );
    });

    console.log(
      '└─────────────────────────────────────────────────────────────┘\n'
    );
  }

  /**
   * Update all submodules to latest
   */
  updateAll() {
    console.log('🔄 Updating all submodules to latest...\n');

    this.exec('git submodule update --remote');

    console.log('✅ All submodules updated!\n');
    this.showStatus();
  }

  /**
   * Update specific submodule
   */
  updateSubmodule(packageName) {
    const submodulePath = `packages/${packageName}`;

    if (!fs.existsSync(path.join(this.rootDir, submodulePath))) {
      console.error(`❌ Package '${packageName}' not found`);
      process.exit(1);
    }

    console.log(`🔄 Updating ${packageName}...\n`);

    this.exec(`git submodule update --remote ${submodulePath}`);

    console.log(`✅ ${packageName} updated!\n`);
    this.showStatus();
  }

  /**
   * Check for uncommitted changes in submodules
   */
  checkDirty() {
    console.log('🔍 Checking for uncommitted changes...\n');

    const result = this.exec('git submodule foreach "git status --porcelain"');

    if (result.trim()) {
      console.log('⚠️  Found uncommitted changes:');
      console.log(result);
      return true;
    } else {
      console.log('✅ All submodules are clean');
      return false;
    }
  }

  /**
   * Sync submodules (update and commit changes)
   */
  sync() {
    console.log('🔄 Syncing all submodules...\n');

    // Update all submodules
    this.updateAll();

    // Check if there are changes to commit
    const hasChanges = this.exec('git status --porcelain').includes(
      'packages/'
    );

    if (hasChanges) {
      console.log('📝 Committing submodule updates...');
      this.exec('git add .');
      this.exec('git commit -m "chore: sync all submodules to latest"');
      console.log('✅ Submodule updates committed!');
    } else {
      console.log('ℹ️  No submodule updates to commit');
    }
  }

  /**
   * Initialize submodules
   */
  init() {
    console.log('🚀 Initializing submodules...\n');

    this.exec('git submodule init');
    this.exec('git submodule update');

    console.log('✅ Submodules initialized!\n');
    this.showStatus();
  }

  /**
   * Show help
   */
  showHelp() {
    console.log(`
🔗 Submodule Manager

Usage: node scripts/submodule-manager.js <command> [options]

Commands:
  status              Show submodule status
  update [package]    Update all submodules or specific package
  sync                Update all submodules and commit changes
  check               Check for uncommitted changes
  init                Initialize all submodules
  help                Show this help

Examples:
  node scripts/submodule-manager.js status
  node scripts/submodule-manager.js update ai-toolkit
  node scripts/submodule-manager.js sync
  node scripts/submodule-manager.js check
`);
  }

  /**
   * Run the manager
   */
  run() {
    const [, , command, ...args] = process.argv;

    switch (command) {
      case 'status':
        this.showStatus();
        break;

      case 'update':
        if (args[0]) {
          this.updateSubmodule(args[0]);
        } else {
          this.updateAll();
        }
        break;

      case 'sync':
        this.sync();
        break;

      case 'check':
        this.checkDirty();
        break;

      case 'init':
        this.init();
        break;

      case 'help':
      case '--help':
      case '-h':
        this.showHelp();
        break;

      default:
        console.log(
          '❌ Unknown command. Use "help" to see available commands.'
        );
        this.showHelp();
        process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const manager = new SubmoduleManager();
  manager.run();
}

module.exports = SubmoduleManager;
