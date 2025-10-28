#!/usr/bin/env node

/**
 * Production Build Testing Script
 * Validates production build performance and optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Production Build Validation...\n');

// Test results storage
const testResults = {
  buildSuccess: false,
  bundleSize: null,
  buildTime: null,
  optimizations: [],
  warnings: [],
  errors: [],
  timestamp: new Date().toISOString(),
};

// Helper function to run commands and capture output
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const startTime = Date.now();
    const output = execSync(command, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    const endTime = Date.now();
    console.log(`✅ ${description} completed in ${endTime - startTime}ms`);
    return { success: true, output, duration: endTime - startTime };
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    testResults.errors.push({
      step: description,
      error: error.message,
      command: command,
    });
    return { success: false, error: error.message };
  }
}

// Helper function to analyze bundle size
function analyzeBundleSize() {
  console.log('📊 Analyzing bundle size...');

  try {
    // Check if dist directory exists (web build)
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      const stats = fs.statSync(distPath);
      console.log(
        `📦 Web bundle directory size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`
      );

      // Analyze individual files
      const files = fs.readdirSync(distPath, { recursive: true });
      let totalSize = 0;
      const largeFiles = [];

      files.forEach((file) => {
        const filePath = path.join(distPath, file);
        if (fs.statSync(filePath).isFile()) {
          const size = fs.statSync(filePath).size;
          totalSize += size;

          if (size > 1024 * 1024) {
            // Files larger than 1MB
            largeFiles.push({
              file: file,
              size: (size / 1024 / 1024).toFixed(2) + ' MB',
            });
          }
        }
      });

      testResults.bundleSize = {
        total: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
        largeFiles: largeFiles,
        fileCount: files.length,
      };

      console.log(`📦 Total bundle size: ${testResults.bundleSize.total}`);
      console.log(`📄 Total files: ${testResults.bundleSize.fileCount}`);

      if (largeFiles.length > 0) {
        console.log('⚠️  Large files detected:');
        largeFiles.forEach((file) => {
          console.log(`   - ${file.file}: ${file.size}`);
        });
        testResults.warnings.push(
          'Large bundle files detected - consider code splitting'
        );
      }

      // Bundle size recommendations
      const totalSizeMB = parseFloat(testResults.bundleSize.total);
      if (totalSizeMB > 10) {
        testResults.warnings.push(
          'Bundle size exceeds 10MB - consider optimization'
        );
      } else if (totalSizeMB > 5) {
        testResults.warnings.push(
          'Bundle size exceeds 5MB - monitor performance'
        );
      } else {
        testResults.optimizations.push('Bundle size is optimized (< 5MB)');
      }
    } else {
      console.log('📦 No web build directory found');
    }

    return true;
  } catch (error) {
    console.log('❌ Bundle analysis failed:', error.message);
    testResults.errors.push({
      step: 'Bundle Analysis',
      error: error.message,
    });
    return false;
  }
}

// Helper function to check TypeScript compilation
function checkTypeScript() {
  console.log('🔍 Checking TypeScript compilation...');

  const result = runCommand('npx tsc --noEmit', 'TypeScript compilation check');
  if (result.success) {
    testResults.optimizations.push(
      'TypeScript compilation successful - no type errors'
    );
    return true;
  } else {
    testResults.errors.push({
      step: 'TypeScript Check',
      error: 'TypeScript compilation failed',
    });
    return false;
  }
}

// Helper function to run linting
function runLinting() {
  console.log('🧹 Running code quality checks...');

  // Check if ESLint is available
  try {
    execSync('npx eslint --version', { stdio: 'pipe' });
    const result = runCommand(
      'npx eslint . --ext .ts,.tsx --max-warnings 0',
      'ESLint check'
    );
    if (result.success) {
      testResults.optimizations.push('Code quality checks passed');
    }
  } catch (error) {
    console.log('⚠️  ESLint not configured, skipping linting');
    testResults.warnings.push(
      'ESLint not configured - consider adding for code quality'
    );
  }
}

// Helper function to check dependencies
function checkDependencies() {
  console.log('📦 Checking dependencies...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    console.log(`📦 Production dependencies: ${dependencies.length}`);
    console.log(`🛠️  Development dependencies: ${devDependencies.length}`);

    // Check for common heavy dependencies
    const heavyDeps = dependencies.filter((dep) =>
      ['lodash', 'moment', 'rxjs'].includes(dep)
    );

    if (heavyDeps.length > 0) {
      testResults.warnings.push(
        `Heavy dependencies detected: ${heavyDeps.join(', ')}`
      );
    }

    testResults.optimizations.push(
      `Dependency analysis completed: ${dependencies.length} prod deps`
    );
    return true;
  } catch (error) {
    console.log('❌ Dependency check failed:', error.message);
    return false;
  }
}

// Main execution
async function runProductionBuildTest() {
  const startTime = Date.now();

  console.log('🎯 Production Build Validation Started');
  console.log('=====================================\n');

  // Step 1: TypeScript compilation check
  const tsCheck = checkTypeScript();

  // Step 2: Dependency analysis
  const depCheck = checkDependencies();

  // Step 3: Code quality checks
  runLinting();

  // Step 4: Try to build for web (fastest build)
  console.log('🏗️  Attempting production build...');
  const buildResult = runCommand(
    'npx expo export --platform web',
    'Web production build'
  );

  if (buildResult.success) {
    testResults.buildSuccess = true;
    testResults.buildTime = buildResult.duration;
    testResults.optimizations.push('Production build successful');

    // Step 5: Analyze bundle size
    analyzeBundleSize();
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  // Generate report
  console.log('\n🎯 Production Build Validation Results');
  console.log('=====================================');
  console.log(`⏱️  Total validation time: ${totalTime}ms`);
  console.log(`✅ Build successful: ${testResults.buildSuccess}`);

  if (testResults.buildTime) {
    console.log(`🏗️  Build time: ${testResults.buildTime}ms`);
  }

  if (testResults.bundleSize) {
    console.log(`📦 Bundle size: ${testResults.bundleSize.total}`);
  }

  console.log(`\n✅ Optimizations (${testResults.optimizations.length}):`);
  testResults.optimizations.forEach((opt) => console.log(`   - ${opt}`));

  if (testResults.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${testResults.warnings.length}):`);
    testResults.warnings.forEach((warning) => console.log(`   - ${warning}`));
  }

  if (testResults.errors.length > 0) {
    console.log(`\n❌ Errors (${testResults.errors.length}):`);
    testResults.errors.forEach((error) =>
      console.log(`   - ${error.step}: ${error.error}`)
    );
  }

  // Save results
  const reportPath = path.join(process.cwd(), 'production-build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // Calculate score
  const score = calculateProductionScore();
  console.log(`\n🎯 Production Readiness Score: ${score}/100`);

  return testResults;
}

function calculateProductionScore() {
  let score = 0;

  // Build success (30 points)
  if (testResults.buildSuccess) score += 30;

  // TypeScript compilation (20 points)
  const hasTypeScriptSuccess = testResults.optimizations.some((opt) =>
    opt.includes('TypeScript compilation successful')
  );
  if (hasTypeScriptSuccess) score += 20;

  // Bundle size optimization (20 points)
  if (testResults.bundleSize) {
    const sizeMB = parseFloat(testResults.bundleSize.total);
    if (sizeMB < 2) score += 20;
    else if (sizeMB < 5) score += 15;
    else if (sizeMB < 10) score += 10;
    else score += 5;
  }

  // Code quality (15 points)
  const hasCodeQuality = testResults.optimizations.some((opt) =>
    opt.includes('Code quality checks passed')
  );
  if (hasCodeQuality) score += 15;

  // Dependency optimization (10 points)
  const hasDependencyCheck = testResults.optimizations.some((opt) =>
    opt.includes('Dependency analysis completed')
  );
  if (hasDependencyCheck) score += 10;

  // Penalty for errors
  score -= testResults.errors.length * 5;

  // Penalty for warnings
  score -= testResults.warnings.length * 2;

  return Math.max(0, Math.min(100, score));
}

// Run the test
if (require.main === module) {
  runProductionBuildTest().catch(console.error);
}

module.exports = { runProductionBuildTest };
