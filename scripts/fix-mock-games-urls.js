#!/usr/bin/env node

/**
 * Fix MockGames Play URLs
 * 
 * This script fixes the playUrl values in mockGames to use proper proxy routes
 * instead of recursive /play/ routes.
 * 
 * Fixes:
 * - lesson-X: /play/lesson-X → /api/proxy/lessons/X
 * - Other /play/ routes → Keep as-is (they have actual content)
 */

const fs = require('fs')
const path = require('path')

const routePath = path.join(process.cwd(), 'src/app/api/games/route.ts')

console.log('🔧 Fixing mockGames playUrl values...\n')

// Read the file
let content = fs.readFileSync(routePath, 'utf8')

// Count fixes
let fixCount = 0

// Fix lesson playUrls: /play/lesson-X → /api/proxy/lessons/X
content = content.replace(
  /playUrl:\s*["']\/play\/lesson-(\d+)["']/g,
  (match, lessonNum) => {
    fixCount++
    return `playUrl: "/api/proxy/lessons/${lessonNum}"`
  }
)

// Write back
fs.writeFileSync(routePath, content, 'utf8')

console.log(`✅ Fixed ${fixCount} lesson playUrls`)
console.log(`   Changed: /play/lesson-X → /api/proxy/lessons/X`)
console.log(`\n📝 File updated: ${routePath}`)
console.log(`\n🎮 Lesson games will now load correctly!`)

