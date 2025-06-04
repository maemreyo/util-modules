#!/usr/bin/env node
// Comprehensive monorepo health monitoring tool

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

class MonorepoHealthMonitor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall: { score: 100, status: 'healthy' },
      packages: {},
      dependencies: {},
      security: {},
      performance: {},
      recommendations: [],
    };
  }

  // Kiểm tra từng package
  async checkPackageHealth(packageName, packagePath) {
    console.log(`\n🔍 Checking ${packageName}...`);

    const health = {
      score: 100,
      issues: [],
      metrics: {},
    };

    // 1. Check package.json
    const pkgJsonPath = join(rootDir, packagePath, 'package.json');
    if (!existsSync(pkgJsonPath)) {
      health.issues.push('Missing package.json');
      health.score -= 20;
    } else {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));

      // Check required fields
      const requiredFields = [
        'name',
        'version',
        'description',
        'main',
        'types',
      ];
      requiredFields.forEach((field) => {
        if (!pkg[field]) {
          health.issues.push(`Missing ${field} in package.json`);
          health.score -= 5;
        }
      });

      // Check scripts
      const requiredScripts = ['build', 'test', 'lint'];
      requiredScripts.forEach((script) => {
        if (!pkg.scripts?.[script]) {
          health.issues.push(`Missing ${script} script`);
          health.score -= 3;
        }
      });
    }

    // 2. Check TypeScript config
    const tsConfigPath = join(rootDir, packagePath, 'tsconfig.json');
    if (!existsSync(tsConfigPath)) {
      health.issues.push('Missing tsconfig.json');
      health.score -= 10;
    }

    // 3. Check tests
    try {
      const testOutput = execSync(
        `pnpm --filter ${packageName} test:coverage`,
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      // Parse coverage
      const coverageMatch = testOutput.match(/Statements\s+:\s+([\d.]+)%/);
      if (coverageMatch) {
        const coverage = parseFloat(coverageMatch[1]);
        health.metrics.testCoverage = coverage;

        if (coverage < 80) {
          health.issues.push(`Low test coverage: ${coverage}%`);
          health.score -= Math.round((80 - coverage) / 2);
        }
      }
    } catch (error) {
      health.issues.push('Tests failed or not found');
      health.score -= 15;
    }

    // 4. Check bundle size
    try {
      const sizeOutput = execSync(`pnpm --filter ${packageName} size`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      // Parse size
      const sizeMatch = sizeOutput.match(/([\d.]+)\s*KB/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        health.metrics.bundleSize = size;

        if (size > 50) {
          health.issues.push(`Large bundle size: ${size}KB`);
          health.score -= 5;
        }
      }
    } catch (error) {
      // Size check not configured
    }

    // 5. Check dependencies
    try {
      const outdated = execSync(
        `pnpm --filter ${packageName} outdated --format json`,
        {
          encoding: 'utf8',
          stdio: 'pipe',
        }
      );

      const outdatedDeps = JSON.parse(outdated || '[]');
      if (outdatedDeps.length > 0) {
        health.metrics.outdatedDeps = outdatedDeps.length;
        health.issues.push(`${outdatedDeps.length} outdated dependencies`);
        health.score -= Math.min(outdatedDeps.length * 2, 10);
      }
    } catch (error) {
      // No outdated deps or command failed
    }

    // 6. Check for security vulnerabilities
    try {
      const audit = execSync(`pnpm --filter ${packageName} audit --json`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });

      const auditResult = JSON.parse(audit || '{}');
      if (auditResult.vulnerabilities) {
        const vulnCount = Object.values(auditResult.vulnerabilities).reduce(
          (sum, v) => sum + (v.via?.length || 0),
          0
        );

        if (vulnCount > 0) {
          health.metrics.vulnerabilities = vulnCount;
          health.issues.push(`${vulnCount} security vulnerabilities`);
          health.score -= Math.min(vulnCount * 5, 20);
        }
      }
    } catch (error) {
      // Audit check failed
    }

    // Calculate final score
    health.score = Math.max(0, health.score);
    health.status = this.getHealthStatus(health.score);

    return health;
  }

  // Kiểm tra dependencies giữa các packages
  async checkCrossDependencies() {
    console.log('\n🔗 Checking cross-dependencies...');

    const deps = {
      graph: {},
      circular: [],
      issues: [],
    };

    // Build dependency graph
    this.packages.forEach((pkg) => {
      const pkgJson = JSON.parse(
        readFileSync(join(rootDir, pkg.path, 'package.json'), 'utf8')
      );

      deps.graph[pkg.name] = [];

      // Check dependencies
      const allDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
        ...pkgJson.peerDependencies,
      };

      Object.keys(allDeps).forEach((dep) => {
        if (dep.startsWith('@matthew.ngo/')) {
          deps.graph[pkg.name].push(dep);
        }
      });
    });

    // Check for circular dependencies
    // Simplified check - in real implementation use proper graph algorithm
    Object.entries(deps.graph).forEach(([pkg, dependencies]) => {
      dependencies.forEach((dep) => {
        if (deps.graph[dep]?.includes(pkg)) {
          deps.circular.push({ from: pkg, to: dep });
          deps.issues.push(`Circular dependency: ${pkg} <-> ${dep}`);
        }
      });
    });

    return deps;
  }

  // Kiểm tra performance metrics
  async checkPerformance() {
    console.log('\n⚡ Checking performance metrics...');

    const perf = {
      buildTime: {},
      testTime: {},
      issues: [],
    };

    // Measure build time for each package
    for (const pkg of this.packages) {
      const start = Date.now();
      try {
        execSync(`pnpm --filter ${pkg.name} build`, {
          stdio: 'pipe',
        });
        const buildTime = Date.now() - start;
        perf.buildTime[pkg.name] = buildTime;

        if (buildTime > 30000) {
          // 30 seconds
          perf.issues.push(`Slow build time for ${pkg.name}: ${buildTime}ms`);
        }
      } catch (error) {
        perf.issues.push(`Build failed for ${pkg.name}`);
      }
    }

    return perf;
  }

  // Kiểm tra monorepo configuration
  async checkMonorepoConfig() {
    console.log('\n⚙️  Checking monorepo configuration...');

    const config = {
      score: 100,
      issues: [],
    };

    // Check workspace config
    if (!existsSync(join(rootDir, 'pnpm-workspace.yaml'))) {
      config.issues.push('Missing pnpm-workspace.yaml');
      config.score -= 20;
    }

    // Check Nx config
    if (!existsSync(join(rootDir, 'nx.json'))) {
      config.issues.push('Missing nx.json');
      config.score -= 10;
    }

    // Check CI/CD
    if (!existsSync(join(rootDir, '.github/workflows/ci.yml'))) {
      config.issues.push('Missing CI workflow');
      config.score -= 15;
    }

    // Check changesets
    if (!existsSync(join(rootDir, '.changeset/config.json'))) {
      config.issues.push('Changesets not configured');
      config.score -= 10;
    }

    // Check linting config
    if (!existsSync(join(rootDir, '.eslintrc.cjs'))) {
      config.issues.push('ESLint not configured');
      config.score -= 10;
    }

    // Check TypeScript config
    if (!existsSync(join(rootDir, 'tsconfig.json'))) {
      config.issues.push('Root TypeScript config missing');
      config.score -= 10;
    }

    return config;
  }

  // Generate recommendations
  generateRecommendations() {
    const recs = [];

    // Package-specific recommendations
    Object.entries(this.results.packages).forEach(([name, health]) => {
      if (health.score < 80) {
        recs.push({
          type: 'package',
          package: name,
          priority: health.score < 60 ? 'high' : 'medium',
          message: `Package ${name} needs attention (score: ${health.score})`,
          actions: health.issues,
        });
      }
    });

    // Dependency recommendations
    if (this.results.dependencies.circular.length > 0) {
      recs.push({
        type: 'architecture',
        priority: 'high',
        message: 'Circular dependencies detected',
        actions: ['Refactor to remove circular dependencies'],
      });
    }

    // Performance recommendations
    if (this.results.performance.issues.length > 0) {
      recs.push({
        type: 'performance',
        priority: 'medium',
        message: 'Performance issues detected',
        actions: this.results.performance.issues,
      });
    }

    return recs;
  }

  getHealthStatus(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 60) return 'poor';
    return 'critical';
  }

  // Generate HTML report
  generateHTMLReport() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Monorepo Health Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .score { font-size: 48px; font-weight: bold; }
    .excellent { color: #22c55e; }
    .good { color: #3b82f6; }
    .fair { color: #f59e0b; }
    .poor { color: #ef4444; }
    .critical { color: #991b1b; }
    .package-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .issue { color: #ef4444; margin: 5px 0; }
    .metric { color: #6b7280; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Monorepo Health Report</h1>
    <p>Generated: ${this.results.timestamp}</p>
    <div class="score ${this.results.overall.status}">
      Overall Score: ${this.results.overall.score}/100
    </div>
  </div>

  <h2>Package Health</h2>
  ${Object.entries(this.results.packages)
    .map(
      ([name, health]) => `
    <div class="package-card">
      <h3>${name} <span class="score ${health.status}">${health.score}/100</span></h3>
      ${
        health.issues.length > 0
          ? `
        <h4>Issues:</h4>
        ${health.issues.map((issue) => `<div class="issue">• ${issue}</div>`).join('')}
      `
          : '<p>✅ No issues found</p>'
      }
      ${
        health.metrics
          ? `
        <h4>Metrics:</h4>
        ${Object.entries(health.metrics)
          .map(([key, value]) => `<div class="metric">• ${key}: ${value}</div>`)
          .join('')}
      `
          : ''
      }
    </div>
  `
    )
    .join('')}

  <h2>Recommendations</h2>
  ${this.results.recommendations
    .map(
      (rec) => `
    <div class="package-card">
      <h4>[${rec.priority.toUpperCase()}] ${rec.message}</h4>
      <ul>
        ${rec.actions.map((action) => `<li>${action}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('')}
</body>
</html>`;

    writeFileSync(join(rootDir, 'health-report.html'), html);
    console.log('\n📄 HTML report generated: health-report.html');
  }

  async run() {
    console.log('🏥 Monorepo Health Check Starting...\n');

    // Get packages
    this.packages = [
      { name: '@matthew.ngo/storage', path: 'packages/storage' },
      { name: '@matthew.ngo/ai-toolkit', path: 'packages/ai-toolkit' },
      {
        name: '@matthew.ngo/content-extractor',
        path: 'packages/content-extractor',
      },
      { name: '@matthew.ngo/analysis', path: 'packages/analysis' },
    ];

    // Check each package
    for (const pkg of this.packages) {
      this.results.packages[pkg.name] = await this.checkPackageHealth(
        pkg.name,
        pkg.path
      );
    }

    // Check cross-dependencies
    this.results.dependencies = await this.checkCrossDependencies();

    // Check performance
    this.results.performance = await this.checkPerformance();

    // Check monorepo config
    this.results.config = await this.checkMonorepoConfig();

    // Calculate overall score
    const scores = Object.values(this.results.packages).map((p) => p.score);
    scores.push(this.results.config.score);
    this.results.overall.score = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
    this.results.overall.status = this.getHealthStatus(
      this.results.overall.score
    );

    // Generate recommendations
    this.results.recommendations = this.generateRecommendations();

    // Save results
    writeFileSync(
      join(rootDir, 'health-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    // Generate HTML report
    this.generateHTMLReport();

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('='.repeat(60));
    console.log(
      `Overall Score: ${this.results.overall.score}/100 (${this.results.overall.status})`
    );
    console.log('\nPackage Scores:');
    Object.entries(this.results.packages).forEach(([name, health]) => {
      console.log(`  ${name}: ${health.score}/100 (${health.status})`);
    });

    if (this.results.recommendations.length > 0) {
      console.log('\n⚠️  Top Recommendations:');
      this.results.recommendations
        .filter((r) => r.priority === 'high')
        .slice(0, 3)
        .forEach((rec) => {
          console.log(`  • ${rec.message}`);
        });
    }

    console.log('\n✅ Health check complete!');
    console.log('📄 Detailed reports saved:');
    console.log('   - health-report.json');
    console.log('   - health-report.html');
  }
}

// Run if main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const monitor = new MonorepoHealthMonitor();
  monitor.run().catch(console.error);
}

export default MonorepoHealthMonitor;
