#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const modules = ['storage', 'ai-toolkit', 'content-extractor', 'analysis'];

class ModuleAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      modules: {},
      summary: {
        totalModules: modules.length,
        healthyModules: 0,
        warningModules: 0,
        criticalModules: 0,
        totalIssues: 0
      }
    };
  }

  async auditModule(moduleName) {
    console.log(`🔍 Auditing module: ${moduleName}`);
    
    const moduleDir = join(rootDir, 'packages', moduleName);
    const packageJsonPath = join(moduleDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      return {
        name: moduleName,
        status: 'critical',
        issues: ['Missing package.json'],
        score: 0
      };
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const issues = [];
    let score = 100;

    // Check basic package.json fields
    if (!packageJson.name) {
      issues.push('Missing package name');
      score -= 10;
    }
    
    if (!packageJson.version) {
      issues.push('Missing version');
      score -= 5;
    }

    if (!packageJson.description) {
      issues.push('Missing description');
      score -= 5;
    }

    // Check scripts
    const requiredScripts = ['build', 'test', 'lint', 'typecheck'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
    if (missingScripts.length > 0) {
      issues.push(`Missing scripts: ${missingScripts.join(', ')}`);
      score -= missingScripts.length * 5;
    }

    // Check TypeScript config
    const tsConfigPath = join(moduleDir, 'tsconfig.json');
    if (!existsSync(tsConfigPath)) {
      issues.push('Missing tsconfig.json');
      score -= 10;
    }

    // Check source directory
    const srcDir = join(moduleDir, 'src');
    if (!existsSync(srcDir)) {
      issues.push('Missing src directory');
      score -= 15;
    }

    // Check tests
    const testsDir = join(moduleDir, 'tests');
    const testDir = join(moduleDir, 'test');
    if (!existsSync(testsDir) && !existsSync(testDir)) {
      issues.push('Missing tests directory');
      score -= 10;
    }

    // Check README
    const readmePath = join(moduleDir, 'README.md');
    if (!existsSync(readmePath)) {
      issues.push('Missing README.md');
      score -= 5;
    }

    // Determine status
    let status = 'healthy';
    if (score < 70) status = 'critical';
    else if (score < 85) status = 'warning';

    return {
      name: moduleName,
      status,
      issues,
      score,
      packageJson: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description
      }
    };
  }

  async searchForTODOs(moduleName) {
    const moduleDir = join(rootDir, 'packages', moduleName);
    const srcDir = join(moduleDir, 'src');
    
    if (!existsSync(srcDir)) return [];

    // This is a simplified TODO search - in real implementation you'd use a proper file walker
    return []; // Placeholder
  }

  async searchForConsoleUsage(moduleName) {
    const moduleDir = join(rootDir, 'packages', moduleName);
    const srcDir = join(moduleDir, 'src');
    
    if (!existsSync(srcDir)) return [];

    // This is a simplified console search - in real implementation you'd use a proper file walker
    return []; // Placeholder
  }

  async run() {
    console.log('🚀 Starting module audit...\n');

    for (const moduleName of modules) {
      const result = await this.auditModule(moduleName);
      this.results.modules[moduleName] = result;

      // Update summary
      if (result.status === 'healthy') this.results.summary.healthyModules++;
      else if (result.status === 'warning') this.results.summary.warningModules++;
      else if (result.status === 'critical') this.results.summary.criticalModules++;
      
      this.results.summary.totalIssues += result.issues.length;

      // Print result
      const statusEmoji = {
        healthy: '✅',
        warning: '⚠️',
        critical: '❌'
      };

      console.log(`${statusEmoji[result.status]} ${moduleName} (Score: ${result.score}/100)`);
      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`   - ${issue}`));
      }
      console.log('');
    }

    // Generate report
    this.generateReport();
    
    console.log('📊 Audit Summary:');
    console.log(`   Healthy: ${this.results.summary.healthyModules}`);
    console.log(`   Warning: ${this.results.summary.warningModules}`);
    console.log(`   Critical: ${this.results.summary.criticalModules}`);
    console.log(`   Total Issues: ${this.results.summary.totalIssues}`);
    console.log('\n📄 Detailed report saved to: audit-report.json');
  }

  generateReport() {
    const reportPath = join(rootDir, 'audit-report.json');
    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
  }
}

// Run audit
const auditor = new ModuleAuditor();
auditor.run().catch(console.error);