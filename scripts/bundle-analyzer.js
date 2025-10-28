#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Analyzes bundle size, dependencies, and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.nodeModulesPath = path.join(this.projectRoot, 'node_modules');
  }

  // Analyze package.json dependencies
  analyzeDependencies() {
    console.log('📦 Analyzing Dependencies...\n');

    const packageJson = JSON.parse(
      fs.readFileSync(this.packageJsonPath, 'utf8')
    );
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    const analysis = {
      totalDependencies: Object.keys(dependencies).length,
      totalDevDependencies: Object.keys(devDependencies).length,
      heavyDependencies: [],
      unusedDependencies: [],
      recommendations: [],
    };

    // Analyze each dependency
    Object.entries(dependencies).forEach(([name, version]) => {
      const depPath = path.join(this.nodeModulesPath, name);
      if (fs.existsSync(depPath)) {
        const size = this.getDirectorySize(depPath);
        if (size > 1024 * 1024) {
          // > 1MB
          analysis.heavyDependencies.push({
            name,
            version,
            size: this.formatBytes(size),
          });
        }
      }
    });

    // Sort heavy dependencies by size
    analysis.heavyDependencies.sort(
      (a, b) => this.parseBytes(b.size) - this.parseBytes(a.size)
    );

    // Generate recommendations
    this.generateDependencyRecommendations(analysis, dependencies);

    return analysis;
  }

  // Generate dependency optimization recommendations
  generateDependencyRecommendations(analysis, dependencies) {
    // Check for common optimization opportunities
    if (dependencies['lodash']) {
      analysis.recommendations.push({
        type: 'optimization',
        message:
          'Consider using lodash-es or individual lodash functions to enable tree shaking',
        impact: 'high',
      });
    }

    if (dependencies['moment']) {
      analysis.recommendations.push({
        type: 'replacement',
        message:
          'Consider replacing moment.js with date-fns or dayjs for smaller bundle size',
        impact: 'high',
      });
    }

    if (analysis.heavyDependencies.length > 5) {
      analysis.recommendations.push({
        type: 'review',
        message:
          'Review heavy dependencies and consider alternatives or lazy loading',
        impact: 'medium',
      });
    }

    // React Native specific recommendations
    if (
      dependencies['react-native-vector-icons'] &&
      dependencies['@expo/vector-icons']
    ) {
      analysis.recommendations.push({
        type: 'duplication',
        message:
          'You have both react-native-vector-icons and @expo/vector-icons. Consider using only one.',
        impact: 'medium',
      });
    }
  }

  // Analyze source code for optimization opportunities
  analyzeSourceCode() {
    console.log('🔍 Analyzing Source Code...\n');

    const analysis = {
      totalFiles: 0,
      totalLines: 0,
      largeFiles: [],
      duplicateCode: [],
      optimizationOpportunities: [],
    };

    const sourceDir = path.join(this.projectRoot, 'app');
    const componentsDir = path.join(this.projectRoot, 'components');
    const sharedDir = path.join(this.projectRoot, 'shared');

    // Analyze each directory
    [sourceDir, componentsDir, sharedDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        this.analyzeDirectory(dir, analysis);
      }
    });

    // Generate source code recommendations
    this.generateSourceCodeRecommendations(analysis);

    return analysis;
  }

  // Analyze directory recursively
  analyzeDirectory(dir, analysis) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.analyzeDirectory(filePath, analysis);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        analysis.totalFiles++;

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        analysis.totalLines += lines;

        // Check for large files
        if (lines > 300) {
          analysis.largeFiles.push({
            path: path.relative(this.projectRoot, filePath),
            lines,
            size: this.formatBytes(stat.size),
          });
        }

        // Check for optimization opportunities
        this.checkOptimizationOpportunities(filePath, content, analysis);
      }
    });
  }

  // Check for code optimization opportunities
  checkOptimizationOpportunities(filePath, content, analysis) {
    const relativePath = path.relative(this.projectRoot, filePath);

    // Check for missing React.memo
    if (
      content.includes('export function') &&
      !content.includes('React.memo') &&
      !content.includes('memo(')
    ) {
      analysis.optimizationOpportunities.push({
        type: 'performance',
        file: relativePath,
        message: 'Consider using React.memo for this component',
        impact: 'medium',
      });
    }

    // Check for missing useCallback
    if (content.includes('onPress=') && !content.includes('useCallback')) {
      analysis.optimizationOpportunities.push({
        type: 'performance',
        file: relativePath,
        message: 'Consider using useCallback for event handlers',
        impact: 'low',
      });
    }

    // Check for console.log in production code
    if (
      content.includes('console.log') &&
      !filePath.includes('.test.') &&
      !filePath.includes('logger')
    ) {
      analysis.optimizationOpportunities.push({
        type: 'cleanup',
        file: relativePath,
        message: 'Remove console.log statements for production',
        impact: 'low',
      });
    }

    // Check for large inline styles
    if (content.includes('StyleSheet.create') && content.length > 10000) {
      analysis.optimizationOpportunities.push({
        type: 'organization',
        file: relativePath,
        message: 'Consider extracting styles to separate file',
        impact: 'low',
      });
    }
  }

  // Generate source code recommendations
  generateSourceCodeRecommendations(analysis) {
    if (analysis.largeFiles.length > 0) {
      analysis.optimizationOpportunities.push({
        type: 'refactoring',
        message: `${analysis.largeFiles.length} large files detected. Consider breaking them into smaller components.`,
        impact: 'medium',
      });
    }

    if (analysis.totalFiles > 50) {
      analysis.optimizationOpportunities.push({
        type: 'architecture',
        message:
          'Consider implementing lazy loading for screens and components',
        impact: 'high',
      });
    }
  }

  // Estimate bundle size
  estimateBundleSize() {
    console.log('📊 Estimating Bundle Size...\n');

    const estimation = {
      dependencies: 0,
      sourceCode: 0,
      assets: 0,
      total: 0,
    };

    // Estimate dependencies size
    if (fs.existsSync(this.nodeModulesPath)) {
      estimation.dependencies = this.getDirectorySize(this.nodeModulesPath);
    }

    // Estimate source code size
    const sourceDirectories = ['app', 'components', 'shared'].map((dir) =>
      path.join(this.projectRoot, dir)
    );

    sourceDirectories.forEach((dir) => {
      if (fs.existsSync(dir)) {
        estimation.sourceCode += this.getDirectorySize(dir);
      }
    });

    // Estimate assets size
    const assetsDir = path.join(this.projectRoot, 'assets');
    if (fs.existsSync(assetsDir)) {
      estimation.assets = this.getDirectorySize(assetsDir);
    }

    estimation.total =
      estimation.dependencies + estimation.sourceCode + estimation.assets;

    return {
      dependencies: this.formatBytes(estimation.dependencies),
      sourceCode: this.formatBytes(estimation.sourceCode),
      assets: this.formatBytes(estimation.assets),
      total: this.formatBytes(estimation.total),
      raw: estimation,
    };
  }

  // Generate optimization report
  generateOptimizationReport() {
    console.log('🚀 Generating Optimization Report...\n');

    const dependencyAnalysis = this.analyzeDependencies();
    const sourceAnalysis = this.analyzeSourceCode();
    const bundleSize = this.estimateBundleSize();

    const report = {
      summary: {
        bundleSize: bundleSize.total,
        totalDependencies: dependencyAnalysis.totalDependencies,
        totalFiles: sourceAnalysis.totalFiles,
        totalLines: sourceAnalysis.totalLines,
      },
      dependencies: dependencyAnalysis,
      sourceCode: sourceAnalysis,
      bundleSize,
      recommendations: this.generateGlobalRecommendations(
        dependencyAnalysis,
        sourceAnalysis,
        bundleSize
      ),
    };

    return report;
  }

  // Generate global recommendations
  generateGlobalRecommendations(depAnalysis, sourceAnalysis, bundleSize) {
    const recommendations = [];

    // Bundle size recommendations
    if (bundleSize.raw.total > 10 * 1024 * 1024) {
      // > 10MB
      recommendations.push({
        priority: 'high',
        category: 'bundle-size',
        message:
          'Bundle size is quite large. Implement code splitting and lazy loading.',
        actions: [
          'Implement screen-level code splitting',
          'Use dynamic imports for heavy components',
          'Optimize dependencies and remove unused ones',
        ],
      });
    }

    // Performance recommendations
    if (sourceAnalysis.optimizationOpportunities.length > 10) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        message: 'Multiple performance optimization opportunities detected.',
        actions: [
          'Implement React.memo for components',
          'Use useCallback for event handlers',
          'Remove console.log statements',
        ],
      });
    }

    // Architecture recommendations
    if (sourceAnalysis.largeFiles.length > 5) {
      recommendations.push({
        priority: 'medium',
        category: 'architecture',
        message:
          'Several large files detected that could benefit from refactoring.',
        actions: [
          'Break large components into smaller ones',
          'Extract reusable logic into custom hooks',
          'Consider component composition patterns',
        ],
      });
    }

    return recommendations;
  }

  // Utility functions
  getDirectorySize(dirPath) {
    let totalSize = 0;

    try {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          totalSize += this.getDirectorySize(filePath);
        } else {
          totalSize += stat.size;
        }
      });
    } catch (error) {
      // Ignore errors (permission issues, etc.)
    }

    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  parseBytes(str) {
    const match = str.match(/^([\d.]+)\s*([KMGT]?B)$/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2];

    const multipliers = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    return value * (multipliers[unit] || 1);
  }

  // Print formatted report
  printReport(report) {
    console.log('='.repeat(60));
    console.log('📊 BUNDLE ANALYSIS REPORT');
    console.log('='.repeat(60));

    // Summary
    console.log('\n📋 SUMMARY');
    console.log('-'.repeat(30));
    console.log(`Bundle Size: ${report.summary.bundleSize}`);
    console.log(`Dependencies: ${report.summary.totalDependencies}`);
    console.log(`Source Files: ${report.summary.totalFiles}`);
    console.log(`Lines of Code: ${report.summary.totalLines}`);

    // Bundle breakdown
    console.log('\n📦 BUNDLE BREAKDOWN');
    console.log('-'.repeat(30));
    console.log(`Dependencies: ${report.bundleSize.dependencies}`);
    console.log(`Source Code: ${report.bundleSize.sourceCode}`);
    console.log(`Assets: ${report.bundleSize.assets}`);
    console.log(`Total: ${report.bundleSize.total}`);

    // Heavy dependencies
    if (report.dependencies.heavyDependencies.length > 0) {
      console.log('\n🏋️  HEAVY DEPENDENCIES');
      console.log('-'.repeat(30));
      report.dependencies.heavyDependencies.slice(0, 5).forEach((dep) => {
        console.log(`${dep.name}: ${dep.size}`);
      });
    }

    // Large files
    if (report.sourceCode.largeFiles.length > 0) {
      console.log('\n📄 LARGE FILES');
      console.log('-'.repeat(30));
      report.sourceCode.largeFiles.slice(0, 5).forEach((file) => {
        console.log(`${file.path}: ${file.lines} lines (${file.size})`);
      });
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('-'.repeat(30));
      report.recommendations.forEach((rec, index) => {
        console.log(
          `${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`
        );
        if (rec.actions) {
          rec.actions.forEach((action) => {
            console.log(`   • ${action}`);
          });
        }
        console.log('');
      });
    }

    console.log('='.repeat(60));
  }

  // Run analysis
  run() {
    console.log('🔍 Starting Bundle Analysis...\n');

    try {
      const report = this.generateOptimizationReport();
      this.printReport(report);

      // Save report to file
      const reportPath = path.join(
        this.projectRoot,
        'bundle-analysis-report.json'
      );
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.error('❌ Error during analysis:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer;
