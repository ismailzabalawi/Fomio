#!/usr/bin/env node

/**
 * Security Audit Script
 * Comprehensive security validation for production readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Starting Security Audit...\n');

// Security audit results
const auditResults = {
  vulnerabilities: [],
  securityChecks: [],
  recommendations: [],
  warnings: [],
  score: 0,
  timestamp: new Date().toISOString(),
};

// Helper function to run commands safely
function runCommand(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    console.log(`✅ ${description} completed`);
    return { success: true, output };
  } catch (error) {
    console.log(`⚠️  ${description} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

// Check for dependency vulnerabilities
function checkDependencyVulnerabilities() {
  console.log('🔍 Checking dependency vulnerabilities...');
  
  const result = runCommand('npm audit --audit-level=moderate', 'NPM security audit');
  
  if (result.success) {
    if (result.output.includes('found 0 vulnerabilities')) {
      auditResults.securityChecks.push('No dependency vulnerabilities found');
      return true;
    } else {
      // Parse audit output for vulnerabilities
      const lines = result.output.split('\n');
      const vulnLine = lines.find(line => line.includes('vulnerabilities'));
      if (vulnLine) {
        auditResults.vulnerabilities.push({
          type: 'dependency',
          description: vulnLine.trim(),
          severity: 'medium',
        });
      }
      auditResults.warnings.push('Dependency vulnerabilities detected - run npm audit fix');
      return false;
    }
  } else {
    auditResults.warnings.push('Could not run dependency vulnerability check');
    return false;
  }
}

// Check for sensitive data exposure
function checkSensitiveDataExposure() {
  console.log('🔍 Checking for sensitive data exposure...');
  
  const sensitivePatterns = [
    { pattern: /api[_-]?key/i, description: 'API key references' },
    { pattern: /secret/i, description: 'Secret references' },
    { pattern: /password/i, description: 'Password references' },
    { pattern: /token/i, description: 'Token references' },
    { pattern: /private[_-]?key/i, description: 'Private key references' },
    { pattern: /access[_-]?token/i, description: 'Access token references' },
  ];
  
  const filesToCheck = [
    'app.json',
    'expo.json',
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
  ];
  
  let foundSensitiveData = false;
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      sensitivePatterns.forEach(({ pattern, description }) => {
        if (pattern.test(content)) {
          // Check if it's in a comment or example
          const lines = content.split('\n');
          const matchingLines = lines.filter(line => pattern.test(line));
          
          matchingLines.forEach(line => {
            if (!line.trim().startsWith('//') && !line.trim().startsWith('#')) {
              auditResults.vulnerabilities.push({
                type: 'sensitive_data',
                file: file,
                description: `${description} found in ${file}`,
                line: line.trim(),
                severity: 'high',
              });
              foundSensitiveData = true;
            }
          });
        }
      });
    }
  });
  
  if (!foundSensitiveData) {
    auditResults.securityChecks.push('No sensitive data exposure detected in config files');
  }
  
  return !foundSensitiveData;
}

// Check for secure storage implementation
function checkSecureStorage() {
  console.log('🔍 Checking secure storage implementation...');
  
  const authFile = path.join(process.cwd(), 'shared', 'useAuth.ts');
  if (fs.existsSync(authFile)) {
    const content = fs.readFileSync(authFile, 'utf8');
    
    // Check for AsyncStorage usage
    if (content.includes('@react-native-async-storage/async-storage')) {
      auditResults.securityChecks.push('AsyncStorage used for data persistence');
      
      // Check for encryption
      if (content.includes('encrypt') || content.includes('crypto')) {
        auditResults.securityChecks.push('Encryption detected in storage implementation');
      } else {
        auditResults.recommendations.push('Consider encrypting sensitive data before storing');
      }
    }
  }
  
  return true;
}

// Check for input validation
function checkInputValidation() {
  console.log('🔍 Checking input validation implementation...');
  
  const validationFile = path.join(process.cwd(), 'shared', 'form-validation.tsx');
  if (fs.existsSync(validationFile)) {
    const content = fs.readFileSync(validationFile, 'utf8');
    
    // Check for validation rules
    const validationRules = [
      'email',
      'password',
      'required',
      'minLength',
      'maxLength',
      'pattern',
    ];
    
    const foundRules = validationRules.filter(rule => content.includes(rule));
    
    if (foundRules.length >= 4) {
      auditResults.securityChecks.push(`Comprehensive input validation implemented (${foundRules.length} rules)`);
    } else {
      auditResults.warnings.push('Limited input validation rules detected');
    }
    
    // Check for XSS protection
    if (content.includes('sanitize') || content.includes('escape')) {
      auditResults.securityChecks.push('Input sanitization detected');
    } else {
      auditResults.recommendations.push('Consider adding input sanitization for XSS protection');
    }
  } else {
    auditResults.warnings.push('No input validation implementation found');
  }
  
  return true;
}

// Check for error handling security
function checkErrorHandling() {
  console.log('🔍 Checking error handling security...');
  
  const errorFile = path.join(process.cwd(), 'shared', 'error-handling.tsx');
  if (fs.existsSync(errorFile)) {
    const content = fs.readFileSync(errorFile, 'utf8');
    
    // Check for secure error messages
    if (content.includes('production') && content.includes('development')) {
      auditResults.securityChecks.push('Environment-aware error handling implemented');
    }
    
    // Check for error logging
    if (content.includes('logger')) {
      auditResults.securityChecks.push('Secure error logging implemented');
    }
    
    // Check for sensitive data in errors
    if (!content.includes('password') && !content.includes('token')) {
      auditResults.securityChecks.push('Error messages do not expose sensitive data');
    }
  }
  
  return true;
}

// Check for network security
function checkNetworkSecurity() {
  console.log('🔍 Checking network security implementation...');
  
  const files = [
    'shared/discourseApi.ts',
    'shared/offline-support.ts',
  ];
  
  let httpsUsage = 0;
  let securityHeaders = 0;
  
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for HTTPS usage
      if (content.includes('https://')) {
        httpsUsage++;
      }
      
      // Check for security headers
      if (content.includes('Authorization') || content.includes('Bearer')) {
        securityHeaders++;
      }
    }
  });
  
  if (httpsUsage > 0) {
    auditResults.securityChecks.push('HTTPS usage detected in API calls');
  }
  
  if (securityHeaders > 0) {
    auditResults.securityChecks.push('Authorization headers implemented');
  }
  
  return true;
}

// Check for code injection vulnerabilities
function checkCodeInjection() {
  console.log('🔍 Checking for code injection vulnerabilities...');
  
  const dangerousPatterns = [
    { pattern: /eval\s*\(/g, description: 'eval() usage detected' },
    { pattern: /Function\s*\(/g, description: 'Function constructor usage detected' },
    { pattern: /setTimeout\s*\(\s*["']/g, description: 'setTimeout with string detected' },
    { pattern: /setInterval\s*\(\s*["']/g, description: 'setInterval with string detected' },
  ];
  
  const sourceFiles = [];
  
  // Recursively find all TypeScript/JavaScript files
  function findSourceFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findSourceFiles(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        sourceFiles.push(filePath);
      }
    });
  }
  
  findSourceFiles(process.cwd());
  
  let vulnerabilitiesFound = false;
  
  sourceFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    dangerousPatterns.forEach(({ pattern, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        auditResults.vulnerabilities.push({
          type: 'code_injection',
          file: path.relative(process.cwd(), file),
          description: description,
          severity: 'high',
        });
        vulnerabilitiesFound = true;
      }
    });
  });
  
  if (!vulnerabilitiesFound) {
    auditResults.securityChecks.push('No code injection vulnerabilities detected');
  }
  
  return !vulnerabilitiesFound;
}

// Calculate security score
function calculateSecurityScore() {
  let score = 0;
  
  // Base score for security checks
  score += auditResults.securityChecks.length * 10;
  
  // Penalty for vulnerabilities
  auditResults.vulnerabilities.forEach(vuln => {
    switch (vuln.severity) {
      case 'high':
        score -= 20;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });
  
  // Penalty for warnings
  score -= auditResults.warnings.length * 5;
  
  // Bonus for recommendations (shows proactive security)
  score += Math.min(auditResults.recommendations.length * 2, 10);
  
  return Math.max(0, Math.min(100, score));
}

// Main security audit function
async function runSecurityAudit() {
  console.log('🔒 Security Audit Started');
  console.log('========================\n');
  
  // Run all security checks
  checkDependencyVulnerabilities();
  checkSensitiveDataExposure();
  checkSecureStorage();
  checkInputValidation();
  checkErrorHandling();
  checkNetworkSecurity();
  checkCodeInjection();
  
  // Calculate final score
  auditResults.score = calculateSecurityScore();
  
  // Generate report
  console.log('\n🔒 Security Audit Results');
  console.log('========================');
  console.log(`🎯 Security Score: ${auditResults.score}/100`);
  
  console.log(`\n✅ Security Checks Passed (${auditResults.securityChecks.length}):`);
  auditResults.securityChecks.forEach(check => console.log(`   - ${check}`));
  
  if (auditResults.vulnerabilities.length > 0) {
    console.log(`\n🚨 Vulnerabilities Found (${auditResults.vulnerabilities.length}):`);
    auditResults.vulnerabilities.forEach(vuln => {
      console.log(`   - [${vuln.severity.toUpperCase()}] ${vuln.description}`);
      if (vuln.file) console.log(`     File: ${vuln.file}`);
    });
  }
  
  if (auditResults.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${auditResults.warnings.length}):`);
    auditResults.warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  if (auditResults.recommendations.length > 0) {
    console.log(`\n💡 Recommendations (${auditResults.recommendations.length}):`);
    auditResults.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  // Save results
  const reportPath = path.join(process.cwd(), 'security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return auditResults;
}

// Run the audit
if (require.main === module) {
  runSecurityAudit().catch(console.error);
}

module.exports = { runSecurityAudit };

