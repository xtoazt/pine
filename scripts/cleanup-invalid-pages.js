#!/usr/bin/env node

/**
 * Clean up invalid game pages
 * 
 * This script scans HTML files and removes pages that:
 * 1. Don't have an iframe element (no game content)
 * 2. Have "game not found" messages
 * 3. Are empty or placeholder pages
 * 4. Have broken game links
 * 
 * Usage:
 *   node scripts/cleanup-invalid-pages.js [options]
 * 
 * Options:
 *   --dry-run         Show what would be deleted without actually deleting
 *   --directories=play,category  Directories to scan (default: play,category)
 *   --skip-backup     Skip creating backup files
 */

const fs = require('fs').promises
const path = require('path')

// Configuration
const CONFIG = {
  dryRun: process.argv.includes('--dry-run'),
  skipBackup: process.argv.includes('--skip-backup'),
  directories: (process.argv.find(a => a.startsWith('--directories='))?.split('=')[1]?.split(',') || ['play', 'category'])
}

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`)
}

// Stats tracking
const stats = {
  total: 0,
  valid: 0,
  invalid: 0,
  deleted: 0,
  errors: 0,
  invalidPages: []
}

/**
 * Check if an HTML page is valid (has game content)
 */
function isValidGamePage(html, filename) {
  const reasons = []
  
  // Check 1: Must have iframe (game content)
  const hasIframe = /<iframe/i.test(html)
  if (!hasIframe) {
    reasons.push('No iframe found')
  }
  
  // Check 2: Check for "not found" messages
  const notFoundPatterns = [
    /game not found/i,
    /404/i,
    /page not found/i,
    /error.*loading/i,
    /unavailable/i,
    /removed/i
  ]
  
  const hasNotFound = notFoundPatterns.some(pattern => pattern.test(html))
  if (hasNotFound) {
    reasons.push('Contains "not found" message')
  }
  
  // Check 3: Check if it's a placeholder/template
  const isPlaceholder = html.includes('url_example') || 
                       html.includes('PLACEHOLDER') ||
                       html.includes('TODO:') ||
                       html.includes('[INSERT')
  if (isPlaceholder) {
    reasons.push('Contains placeholder content')
  }
  
  // Check 4: Check if HTML is too small (likely broken)
  if (html.length < 500) {
    reasons.push('File too small (< 500 bytes)')
  }
  
  // Check 5: Check for empty body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch && bodyMatch[1].trim().length < 100) {
    reasons.push('Body content too small')
  }
  
  // Page is valid if it has iframe AND no issues
  const isValid = hasIframe && reasons.length === 0
  
  return {
    isValid,
    reasons
  }
}

/**
 * Scan a directory for HTML files
 */
async function scanDirectory(dirPath) {
  const results = {
    valid: [],
    invalid: []
  }
  
  try {
    const files = await fs.readdir(dirPath)
    const htmlFiles = files.filter(f => f.endsWith('.html'))
    
    log(`\n📁 Scanning ${dirPath}/ (${htmlFiles.length} HTML files)`, 'cyan')
    
    for (const file of htmlFiles) {
      stats.total++
      const filePath = path.join(dirPath, file)
      
      try {
        const content = await fs.readFile(filePath, 'utf8')
        const validation = isValidGamePage(content, file)
        
        if (validation.isValid) {
          stats.valid++
          results.valid.push(filePath)
          log(`  ✅ ${file}`, 'green')
        } else {
          stats.invalid++
          results.invalid.push({
            path: filePath,
            file,
            reasons: validation.reasons
          })
          stats.invalidPages.push({
            path: filePath,
            file,
            reasons: validation.reasons
          })
          log(`  ❌ ${file} - ${validation.reasons.join(', ')}`, 'red')
        }
      } catch (err) {
        stats.errors++
        log(`  ⚠️  ${file} - Error reading: ${err.message}`, 'yellow')
      }
    }
  } catch (err) {
    log(`  ❌ Error scanning directory: ${err.message}`, 'red')
  }
  
  return results
}

/**
 * Create backup of files
 */
async function createBackup(files) {
  if (CONFIG.skipBackup || files.length === 0) return
  
  const backupDir = path.join(process.cwd(), `backup-pages-${Date.now()}`)
  
  try {
    await fs.mkdir(backupDir, { recursive: true })
    
    for (const fileInfo of files) {
      const fileName = path.basename(fileInfo.path)
      const backupPath = path.join(backupDir, fileName)
      await fs.copyFile(fileInfo.path, backupPath)
    }
    
    log(`\n💾 Backup created: ${backupDir}`, 'green')
  } catch (err) {
    log(`\n⚠️  Backup failed: ${err.message}`, 'yellow')
  }
}

/**
 * Delete invalid pages
 */
async function deleteInvalidPages(invalidPages) {
  if (invalidPages.length === 0) {
    log('\n✅ No invalid pages to delete', 'green')
    return
  }
  
  log(`\n🗑️  Deleting ${invalidPages.length} invalid pages...`, 'cyan')
  
  for (const pageInfo of invalidPages) {
    try {
      if (!CONFIG.dryRun) {
        await fs.unlink(pageInfo.path)
        stats.deleted++
      }
      log(`  🗑️  Deleted: ${pageInfo.file}`, CONFIG.dryRun ? 'yellow' : 'red')
    } catch (err) {
      log(`  ❌ Failed to delete ${pageInfo.file}: ${err.message}`, 'red')
    }
  }
}

/**
 * Generate report
 */
function generateReport() {
  log('\n' + '='.repeat(60), 'cyan')
  log('📊 CLEANUP REPORT', 'cyan')
  log('='.repeat(60), 'cyan')
  
  log(`\n📈 Overall Stats:`, 'blue')
  log(`  Total pages scanned: ${stats.total}`, 'gray')
  log(`  ✅ Valid pages: ${stats.valid} (${((stats.valid/stats.total)*100).toFixed(1)}%)`, 'green')
  log(`  ❌ Invalid pages: ${stats.invalid} (${((stats.invalid/stats.total)*100).toFixed(1)}%)`, 'red')
  log(`  🗑️  Pages deleted: ${stats.deleted}`, stats.deleted > 0 ? 'red' : 'gray')
  
  if (stats.invalid > 0) {
    log(`\n❌ Invalid Pages Details:`, 'blue')
    
    // Group by reason
    const reasonCounts = {}
    stats.invalidPages.forEach(page => {
      page.reasons.forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
      })
    })
    
    log(`\n  Common Issues:`, 'cyan')
    Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([reason, count]) => {
        log(`    ${reason}: ${count}`, 'red')
      })
    
    if (stats.invalidPages.length <= 20) {
      log(`\n  Files:`, 'cyan')
      stats.invalidPages.forEach(page => {
        log(`    ${page.file} - ${page.reasons.join(', ')}`, 'gray')
      })
    }
  }
  
  if (CONFIG.dryRun) {
    log(`\n💡 This was a DRY RUN - no files were deleted`, 'yellow')
    log(`   Run without --dry-run to actually delete invalid pages`, 'gray')
  } else if (stats.deleted > 0) {
    log(`\n✅ Deleted ${stats.deleted} invalid pages`, 'green')
  }
  
  log('\n' + '='.repeat(60), 'cyan')
}

/**
 * Main execution
 */
async function main() {
  log('\n🧹 Pine Page Cleanup Tool', 'cyan')
  log('='.repeat(60), 'cyan')
  
  if (CONFIG.dryRun) {
    log('🔍 DRY RUN MODE - No files will be deleted', 'yellow')
  }
  
  log(`\nConfiguration:`, 'blue')
  log(`  Directories: ${CONFIG.directories.join(', ')}`, 'gray')
  log(`  Skip backup: ${CONFIG.skipBackup}`, 'gray')
  
  let allInvalidPages = []
  
  try {
    // Scan each directory
    for (const dir of CONFIG.directories) {
      const dirPath = path.join(process.cwd(), dir)
      
      // Check if directory exists
      try {
        await fs.access(dirPath)
      } catch {
        log(`\n⚠️  Directory not found: ${dir}`, 'yellow')
        continue
      }
      
      const results = await scanDirectory(dirPath)
      allInvalidPages = allInvalidPages.concat(results.invalid)
    }
    
    // Create backup before deletion
    if (!CONFIG.dryRun && allInvalidPages.length > 0 && !CONFIG.skipBackup) {
      await createBackup(allInvalidPages)
    }
    
    // Delete invalid pages
    if (allInvalidPages.length > 0) {
      await deleteInvalidPages(allInvalidPages)
    }
    
    // Generate report
    generateReport()
    
  } catch (err) {
    log(`\n❌ Fatal error: ${err.message}`, 'red')
    console.error(err)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
}

module.exports = { isValidGamePage, scanDirectory }

