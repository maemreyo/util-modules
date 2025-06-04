#!/usr/bin/env node
// Workspace dependencies management tool

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

class WorkspaceDepsManager {
  constructor() {
    this.packages = this.loadPackages();
  }

  loadPackages() {
    const packages = [
      { name: '@matthew.ngo/storage', path: 'packages/storage' },
      { name: '@matthew.ngo/ai-toolkit', path: 'packages/ai-toolkit' },
      {
        name: '@matthew.ngo/content-extractor',
        path: 'packages/content-extractor',
      },
      { name: '@matthew.ngo/analysis', path: 'packages/analysis' },
    ];

    return packages.map((pkg) => {
      const packageJsonPath = join(rootDir, pkg.path, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return {
        ...pkg,
        packageJson,
        packageJsonPath,
      };
    });
  }

  // Thêm dependency vào một hoặc nhiều packages
  async addDependency(packageNames, dependency, isDev = false) {
    const packages =
      packageNames === 'all'
        ? this.packages
        : this.packages.filter((p) => packageNames.includes(p.name));

    console.log(
      `\n📦 Adding ${dependency} to ${packages.length} package(s)...`
    );

    for (const pkg of packages) {
      const cmd = `pnpm --filter ${pkg.name} add ${isDev ? '-D' : ''} ${dependency}`;
      console.log(`  Running: ${cmd}`);

      try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(`  ✅ Added to ${pkg.name}`);
      } catch (error) {
        console.error(`  ❌ Failed to add to ${pkg.name}`);
      }
    }
  }

  // Update dependencies
  async updateDependencies(packageNames, updateType = 'latest') {
    const packages =
      packageNames === 'all'
        ? this.packages
        : this.packages.filter((p) => packageNames.includes(p.name));

    console.log(
      `\n🔄 Updating dependencies for ${packages.length} package(s)...`
    );

    for (const pkg of packages) {
      const cmd = `pnpm --filter ${pkg.name} update ${updateType === 'latest' ? '--latest' : ''}`;
      console.log(`  Running: ${cmd}`);

      try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(`  ✅ Updated ${pkg.name}`);
      } catch (error) {
        console.error(`  ❌ Failed to update ${pkg.name}`);
      }
    }
  }

  // Kiểm tra outdated dependencies
  async checkOutdated() {
    console.log('\n🔍 Checking outdated dependencies...\n');

    const allOutdated = {};

    for (const pkg of this.packages) {
      try {
        const output = execSync(`pnpm --filter ${pkg.name} outdated`, {
          encoding: 'utf8',
          stdio: 'pipe',
        });

        if (output.trim()) {
          console.log(`📦 ${pkg.name}:`);
          console.log(output);
          allOutdated[pkg.name] = output;
        } else {
          console.log(`✅ ${pkg.name}: All dependencies up to date`);
        }
      } catch (error) {
        // pnpm outdated returns non-zero exit code when outdated deps exist
        if (error.stdout) {
          console.log(`📦 ${pkg.name}:`);
          console.log(error.stdout);
          allOutdated[pkg.name] = error.stdout;
        }
      }
    }

    return allOutdated;
  }

  // Sync common dependencies across packages
  async syncCommonDependencies() {
    console.log('\n🔄 Syncing common dependencies...\n');

    // Collect all dependencies
    const depMap = new Map();

    this.packages.forEach((pkg) => {
      const deps = {
        ...pkg.packageJson.dependencies,
        ...pkg.packageJson.devDependencies,
      };

      Object.entries(deps).forEach(([name, version]) => {
        if (!depMap.has(name)) {
          depMap.set(name, new Map());
        }
        depMap.get(name).set(pkg.name, version);
      });
    });

    // Find inconsistencies
    const inconsistencies = [];

    depMap.forEach((versions, depName) => {
      const uniqueVersions = new Set(versions.values());

      if (uniqueVersions.size > 1) {
        inconsistencies.push({
          dependency: depName,
          versions: Array.from(versions.entries()),
        });
      }
    });

    if (inconsistencies.length === 0) {
      console.log('✅ All common dependencies are in sync!');
      return;
    }

    console.log(`Found ${inconsistencies.length} inconsistencies:\n`);

    inconsistencies.forEach(({ dependency, versions }) => {
      console.log(`📦 ${dependency}:`);
      versions.forEach(([pkg, version]) => {
        console.log(`   ${pkg}: ${version}`);
      });
      console.log('');
    });

    // Option to fix
    // In a real implementation, this would be interactive
    console.log('To fix inconsistencies, run:');
    console.log('  pnpm manage-deps sync --fix');
  }

  // Remove unused dependencies
  async removeUnused() {
    console.log('\n🧹 Checking for unused dependencies...\n');

    for (const pkg of this.packages) {
      console.log(`Checking ${pkg.name}...`);

      try {
        // Using depcheck or similar tool
        const cmd = `npx depcheck ${pkg.path} --json`;
        const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
        const result = JSON.parse(output);

        if (result.dependencies.length > 0) {
          console.log(
            `  Unused dependencies: ${result.dependencies.join(', ')}`
          );
        }
        if (result.devDependencies.length > 0) {
          console.log(
            `  Unused devDependencies: ${result.devDependencies.join(', ')}`
          );
        }

        if (
          result.dependencies.length === 0 &&
          result.devDependencies.length === 0
        ) {
          console.log('  ✅ No unused dependencies');
        }
      } catch (error) {
        console.log('  ⚠️  Could not check (install depcheck globally)');
      }
    }
  }

  // Show dependency graph
  async showDependencyGraph() {
    console.log('\n🌳 Internal Dependency Graph:\n');

    const internalDeps = {};

    this.packages.forEach((pkg) => {
      internalDeps[pkg.name] = [];

      const deps = {
        ...pkg.packageJson.dependencies,
        ...pkg.packageJson.devDependencies,
        ...pkg.packageJson.peerDependencies,
      };

      Object.keys(deps).forEach((dep) => {
        if (dep.startsWith('@matthew.ngo/')) {
          internalDeps[pkg.name].push(dep);
        }
      });
    });

    // Display graph
    Object.entries(internalDeps).forEach(([pkg, deps]) => {
      console.log(`${pkg}`);
      if (deps.length === 0) {
        console.log('  └─ (no internal dependencies)');
      } else {
        deps.forEach((dep, index) => {
          const isLast = index === deps.length - 1;
          console.log(`  ${isLast ? '└─' : '├─'} ${dep}`);
        });
      }
      console.log('');
    });

    // Run Nx graph command if available
    console.log('For interactive graph visualization, run: pnpm graph');
  }

  async run(command, args) {
    switch (command) {
      case 'add':
        const [packages, ...deps] = args;
        const isDev = args.includes('-D') || args.includes('--dev');
        const depString = deps
          .filter((d) => d !== '-D' && d !== '--dev')
          .join(' ');
        await this.addDependency(
          packages === 'all' ? 'all' : packages.split(','),
          depString,
          isDev
        );
        break;

      case 'update':
        const updatePackages = args[0] || 'all';
        const updateType = args[1] || 'latest';
        await this.updateDependencies(
          updatePackages === 'all' ? 'all' : updatePackages.split(','),
          updateType
        );
        break;

      case 'outdated':
        await this.checkOutdated();
        break;

      case 'sync':
        await this.syncCommonDependencies();
        break;

      case 'unused':
        await this.removeUnused();
        break;

      case 'graph':
        await this.showDependencyGraph();
        break;

      default:
        this.showHelp();
    }
  }

  showHelp() {
    console.log(`
Workspace Dependencies Manager

Usage:
  pnpm manage-deps <command> [options]

Commands:
  add <packages> <deps...>     Add dependencies to packages
                               packages: all | package1,package2
                               Example: pnpm manage-deps add all lodash
                               Example: pnpm manage-deps add @matthew.ngo/storage,@matthew.ngo/ai-toolkit axios -D

  update [packages] [type]     Update dependencies
                               packages: all | package1,package2 (default: all)
                               type: latest | patch (default: latest)
                               Example: pnpm manage-deps update all latest

  outdated                     Check for outdated dependencies
                               Example: pnpm manage-deps outdated

  sync                         Check and sync common dependencies
                               Example: pnpm manage-deps sync

  unused                       Find unused dependencies
                               Example: pnpm manage-deps unused

  graph                        Show internal dependency graph
                               Example: pnpm manage-deps graph

Examples:
  # Add lodash to all packages
  pnpm manage-deps add all lodash

  # Add dev dependency to specific packages
  pnpm manage-deps add @matthew.ngo/storage,@matthew.ngo/ai-toolkit @types/node -D

  # Update all packages to latest
  pnpm manage-deps update

  # Check outdated dependencies
  pnpm manage-deps outdated
`);
  }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , command, ...args] = process.argv;
  const manager = new WorkspaceDepsManager();

  if (!command) {
    manager.showHelp();
  } else {
    manager.run(command, args).catch(console.error);
  }
}

export default WorkspaceDepsManager;
