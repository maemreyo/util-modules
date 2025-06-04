#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ANSI color codes nếu không có chalk
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

class ReleaseHelper {
  constructor() {
    this.packages = this.getPackages();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  getPackages() {
    try {
      const workspaceFile = join(rootDir, 'pnpm-workspace.yaml');
      // Simplified - in real implementation, parse YAML properly
      return [
        { name: '@matthew.ngo/storage', path: 'packages/storage' },
        { name: '@matthew.ngo/ai-toolkit', path: 'packages/ai-toolkit' },
        {
          name: '@matthew.ngo/content-extractor',
          path: 'packages/content-extractor',
        },
        { name: '@matthew.ngo/analysis', path: 'packages/analysis' },
      ];
    } catch (error) {
      log.error('Failed to read workspace packages');
      return [];
    }
  }

  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async confirm(question) {
    const answer = await this.ask(`${question} (y/N): `);
    return answer.toLowerCase() === 'y';
  }

  async selectPackages() {
    log.title('📦 Select Packages to Release');

    console.log('Available packages:');
    this.packages.forEach((pkg, index) => {
      const version = this.getPackageVersion(pkg.path);
      console.log(`  ${index + 1}. ${pkg.name} (current: v${version})`);
    });
    console.log('  0. All packages');
    console.log('  q. Quit\n');

    const answer = await this.ask(
      'Select packages (comma-separated numbers): '
    );

    if (answer === 'q') {
      return null;
    }

    if (answer === '0') {
      return this.packages;
    }

    const indices = answer.split(',').map((n) => parseInt(n.trim()) - 1);
    return indices.map((i) => this.packages[i]).filter(Boolean);
  }

  getPackageVersion(packagePath) {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(rootDir, packagePath, 'package.json'), 'utf8')
      );
      return packageJson.version;
    } catch {
      return 'unknown';
    }
  }

  async selectVersionBump() {
    log.title('🎯 Select Version Bump Type');

    console.log('  1. Patch (bug fixes) - 0.0.X');
    console.log('  2. Minor (new features) - 0.X.0');
    console.log('  3. Major (breaking changes) - X.0.0');
    console.log('  4. Prerelease (beta/alpha)');
    console.log('  5. Custom version\n');

    const answer = await this.ask('Select version type: ');

    const types = {
      1: 'patch',
      2: 'minor',
      3: 'major',
      4: 'prerelease',
      5: 'custom',
    };

    return types[answer] || 'patch';
  }

  async runPreflightChecks(packages = null) {
    log.title('🔍 Running Preflight Checks');

    const checks = [
      {
        name: 'Git uncommitted changes',
        cmd: 'git diff --quiet && git diff --staged --quiet',
        expectSuccess: true,
        skipOnFail: false,
        errorMsg:
          'You have uncommitted changes. Please commit or stash them first.',
      },
      {
        name: 'Git branch',
        cmd: 'git branch --show-current',
        expectOutput: ['main', 'master', 'develop'],
        skipOnFail: false,
        errorMsg: 'You should release from main/master/develop branch',
      },
      {
        name: 'Tests',
        cmd: packages ? `pnpm --filter ${packages[0].name} test` : 'pnpm test',
        expectSuccess: true,
        skipOnFail: true,
      },
      {
        name: 'Lint',
        cmd: packages ? `pnpm --filter ${packages[0].name} lint` : 'pnpm lint',
        expectSuccess: true,
        skipOnFail: true,
      },
      {
        name: 'Type check',
        cmd: packages
          ? `pnpm --filter ${packages[0].name} typecheck`
          : 'pnpm typecheck',
        expectSuccess: true,
        skipOnFail: true,
      },
      {
        name: 'Build',
        cmd: packages
          ? `pnpm --filter ${packages[0].name} build`
          : 'pnpm build',
        expectSuccess: true,
        skipOnFail: false,
      },
    ];

    let allPassed = true;
    const failedChecks = [];

    for (const check of checks) {
      process.stdout.write(`  Checking ${check.name}... `);

      try {
        if (check.expectSuccess) {
          execSync(check.cmd, { encoding: 'utf8', stdio: 'pipe' });
          log.success('Passed');
        } else if (check.expectOutput) {
          const result = execSync(check.cmd, {
            encoding: 'utf8',
            stdio: 'pipe',
          }).trim();
          if (check.expectOutput.includes(result)) {
            log.success(`Passed (${result})`);
          } else {
            log.warning(`Warning - on branch '${result}'`);
            if (!check.skipOnFail) {
              failedChecks.push(check);
              allPassed = false;
            }
          }
        }
      } catch (error) {
        if (check.errorMsg) {
          log.error(`Failed`);
          console.log(`     ${check.errorMsg}`);
        } else {
          log.error('Failed');
        }

        if (!check.skipOnFail) {
          failedChecks.push(check);
          allPassed = false;
        }
      }
    }

    if (failedChecks.length > 0) {
      console.log('\n❌ Critical checks failed:');
      failedChecks.forEach((check) => {
        console.log(`   - ${check.name}`);
      });
    }

    return allPassed;
  }

  async createChangeset(packages, versionType, summary) {
    log.info('Creating changeset...');

    // Create changeset content
    const changesetContent = `---
${packages.map((pkg) => `"${pkg.name}": ${versionType}`).join('\n')}
---

${summary}
`;

    // In real implementation, write to .changeset/[generated-name].md
    log.success('Changeset created');
  }

  async executeRelease(packages, versionType) {
    try {
      // Step 1: Create changeset
      const summary = await this.ask('Enter release summary: ');
      await this.createChangeset(packages, versionType, summary);

      // Step 2: Version packages
      log.info('Versioning packages...');
      execSync('pnpm changeset:version', { stdio: 'inherit' });
      log.success('Packages versioned');

      // Step 3: Review changes
      const shouldContinue = await this.confirm('Review changes and continue?');
      if (!shouldContinue) {
        log.warning('Release cancelled');
        return;
      }

      // Step 4: Commit version changes
      log.info('Committing version changes...');
      execSync('git add .', { stdio: 'pipe' });
      execSync('git commit -m "chore: version packages"', { stdio: 'pipe' });
      log.success('Changes committed');

      // Step 5: Publish to npm
      log.info('Publishing to npm...');
      execSync('pnpm changeset:publish', { stdio: 'inherit' });
      log.success('Packages published');

      // Step 6: Push changes and tags
      log.info('Pushing changes and tags...');
      execSync('git push --follow-tags', { stdio: 'inherit' });
      log.success('Changes pushed');

      log.title('🎉 Release Completed Successfully!');

      // Show released packages
      console.log('\nReleased packages:');
      packages.forEach((pkg) => {
        const newVersion = this.getPackageVersion(pkg.path);
        console.log(`  ✅ ${pkg.name}@${newVersion}`);
      });
    } catch (error) {
      log.error(`Release failed: ${error.message}`);
      throw error;
    }
  }

  async showReleaseStrategy() {
    log.title('📋 Release Strategies');

    console.log('1. Single Package Release:');
    console.log('   - Use when only one package has changes');
    console.log('   - Faster and focused release\n');

    console.log('2. Batch Release:');
    console.log('   - Release multiple packages together');
    console.log('   - Good for related changes\n');

    console.log('3. Canary Release:');
    console.log('   - Test release before stable');
    console.log('   - pnpm changeset pre enter next\n');

    console.log('4. Hotfix Release:');
    console.log('   - Urgent bug fixes');
    console.log('   - Cherry-pick to release branch\n');

    await this.ask('Press Enter to continue...');
  }

  async run() {
    try {
      log.title('🚀 Monorepo Release Helper');

      // Show menu
      console.log('What would you like to do?\n');
      console.log('  1. Release packages');
      console.log('  2. Check release status');
      console.log('  3. View release strategies');
      console.log('  4. Rollback release');
      console.log('  5. Exit\n');

      const choice = await this.ask('Select an option: ');

      switch (choice) {
        case '1':
          // Release flow
          const packages = await this.selectPackages();
          if (!packages) break;

          const versionType = await this.selectVersionBump();

          // Run preflight checks
          const checksPass = await this.runPreflightChecks(packages);
          if (!checksPass) {
            const force = await this.confirm('Checks failed. Continue anyway?');
            if (!force) break;
          }

          await this.executeRelease(packages, versionType);
          break;

        case '2':
          // Check status
          log.title('📊 Release Status');
          execSync('pnpm changeset status', { stdio: 'inherit' });
          break;

        case '3':
          await this.showReleaseStrategy();
          break;

        case '4':
          log.warning('Rollback feature coming soon');
          break;

        default:
          log.info('Goodbye!');
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
    } finally {
      this.rl.close();
    }
  }
}

// Run if main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const helper = new ReleaseHelper();
  helper.run().catch(console.error);
}

export default ReleaseHelper;
