# Game Validation & Cleanup System

This document explains how to use the comprehensive game validation and cleanup tools to identify and remove non-working games from Pine.

## 🎯 Overview

Pine includes games from multiple sources (Poki, PlayGama, mockGames, etc.). Over time, some games may break due to:
- Dead links
- Moved/deleted content
- CORS issues
- Server errors
- Invalid URLs

The validation system performs comprehensive checks on all games and removes broken ones automatically.

## 🚀 Quick Start

### 1. Quick Test (Recommended First Step)

Test a small sample (5 games from each source) to get a quick overview:

```bash
node scripts/quick-test-games.js
```

This will show you:
- How many games are working vs broken
- Which sources have issues
- Sample error messages

### 2. Dry Run Validation

Validate all games without making any changes:

```bash
node scripts/validate-and-cleanup-games.js --dry-run
```

This will:
- Check all games from all sources
- Show what would be removed
- Generate a detailed report
- **Not modify any files**

### 3. Full Validation & Cleanup

Once you're confident, run the full cleanup:

```bash
node scripts/validate-and-cleanup-games.js
```

This will:
- Backup all original files (with timestamps)
- Validate all games
- Remove broken games
- Generate a detailed report

## 📋 Command Options

### validate-and-cleanup-games.js

```bash
# Basic usage
node scripts/validate-and-cleanup-games.js

# Options
--dry-run                    # Show what would be removed without making changes
--timeout=5000              # Set timeout in ms for each request (default: 5000)
--max-games=100             # Limit validation to first N games per source
--sources=poki,playgama     # Only validate specific sources
--skip-backup               # Skip creating backup files
--parallel=10               # Number of parallel validation requests (default: 10)

# Examples
node scripts/validate-and-cleanup-games.js --dry-run --max-games=50
node scripts/validate-and-cleanup-games.js --sources=poki --parallel=20
node scripts/validate-and-cleanup-games.js --timeout=10000 --skip-backup
```

## 🔍 Validation Checks

The validation system performs multiple checks on each game:

### 1. **URL Format Validation**
- Checks if the URL is properly formatted
- Validates protocol (http/https)

### 2. **Accessibility Check** 
- Makes HEAD request to check if URL responds
- Falls back to GET request if HEAD fails
- Checks HTTP status codes (200-399 = valid)

### 3. **Content Validation**
- Reads first 8KB of content
- Checks if it's an error page
- Validates content-type for HTML games

### 4. **Response Time Check**
- Configurable timeout (default 5 seconds)
- Marks slow/non-responding games as broken

### 5. **Smart Skip Patterns**
The validator automatically skips validation for URLs that work differently:
- Internal proxies (`/api/proxy/`, `/api/ds/proxy`, etc.)
- Classroom/lesson games
- Data URLs
- Blob URLs

## 📊 Reports

After validation, you'll get:

### 1. **Console Report**
- Overall stats (total, valid, broken)
- Breakdown by source
- Common error types
- Top broken games

### 2. **JSON Report File**
Saved as `validation-report-{timestamp}.json`:
```json
{
  "timestamp": "2025-01-08T...",
  "config": { /* validation config */ },
  "stats": {
    "total": 5000,
    "valid": 4500,
    "broken": 500,
    "bySource": { /* per-source stats */ }
  },
  "brokenGames": [
    {
      "id": "game-123",
      "title": "Broken Game",
      "source": "poki",
      "reason": "HTTP 404",
      "url": "https://..."
    }
  ]
}
```

## 🗂️ What Gets Validated

### ✅ Automatically Validated & Cleaned

#### 1. **Poki Games** (`poki-games.json`)
- ~5,000+ games from Poki
- Validates playUrl field
- Removes broken games from JSON

#### 2. **PlayGama Games** (`playgama-games.json`)
- ~3,000+ games from PlayGama
- Validates gameURL field
- Removes broken games from segments

#### 3. **Mock Games** (`src/app/api/games/route.ts`)
- Static games in mockGames array
- Validates playUrl field
- **Note**: Requires manual removal (script identifies them)

### Sources NOT Validated (Dynamic/Proxied)

These sources fetch games dynamically and handle errors at runtime:
- GameDistribution (gamedist)
- GameSnacks (gamesnacks)
- Radon Games (radon)
- Classwork Games
- Arcade Games
- GameMonetize

## 🔧 Manual Cleanup (mockGames)

For games in `src/app/api/games/route.ts`, the script identifies broken games but doesn't auto-remove them (to avoid breaking code).

**To manually remove:**

1. Run validation with `--sources=mockGames`
2. Review the reported broken game IDs
3. Search for each ID in `route.ts`
4. Remove the entire game object

Example:
```typescript
// BEFORE
const mockGames: Game[] = [
  {
    id: 'broken-game-123',  // ← Remove this entire object
    title: 'Broken Game',
    playUrl: 'https://dead-link.com',
    // ...
  },
  {
    id: 'working-game',
    // ... keep this
  }
]

// AFTER
const mockGames: Game[] = [
  {
    id: 'working-game',
    // ... keep this
  }
]
```

## 💾 Backups

By default, the script creates timestamped backups:
- `poki-games.json.backup.{timestamp}.json`
- `playgama-games.json.backup.{timestamp}.json`

To restore:
```bash
# Copy backup back to original
cp poki-games.json.backup.1234567890.json poki-games.json
```

Skip backups with `--skip-backup` flag.

## 🎯 Recommended Workflow

### First Time Setup

```bash
# 1. Quick test to see current status
node scripts/quick-test-games.js

# 2. Run dry-run on a small sample
node scripts/validate-and-cleanup-games.js --dry-run --max-games=100

# 3. Review the report and adjust timeout/settings if needed

# 4. Run full dry-run
node scripts/validate-and-cleanup-games.js --dry-run

# 5. If everything looks good, run actual cleanup
node scripts/validate-and-cleanup-games.js
```

### Regular Maintenance

```bash
# Quick monthly check
node scripts/quick-test-games.js

# If issues found, run full validation
node scripts/validate-and-cleanup-games.js --parallel=20
```

### Validating Specific Sources

```bash
# Just Poki games
node scripts/validate-and-cleanup-games.js --sources=poki

# Just PlayGama games  
node scripts/validate-and-cleanup-games.js --sources=playgama

# Multiple sources
node scripts/validate-and-cleanup-games.js --sources=poki,playgama,mockGames
```

## ⚡ Performance Tips

1. **Increase Parallelism**: Use `--parallel=20` or higher for faster validation
2. **Adjust Timeout**: Use `--timeout=3000` for faster checks (may miss slow-loading games)
3. **Test First**: Always use `--max-games=100` first to tune settings
4. **Skip Backups**: Use `--skip-backup` if you have external backups

## 🐛 Troubleshooting

### "Too many games failing"
- Increase timeout: `--timeout=10000`
- Reduce parallelism: `--parallel=5`
- Check your internet connection

### "Script is too slow"
- Increase parallelism: `--parallel=30`
- Reduce timeout: `--timeout=3000`
- Validate specific sources: `--sources=poki`

### "All games marked as broken"
- Check network/firewall
- Some games may block automated requests
- Try with `--max-games=10` first

### "Want to restore backups"
```bash
# List backups
ls -la *.backup.*.json

# Restore specific backup
cp poki-games.json.backup.1234567890.json poki-games.json
```

## 📈 Expected Results

Based on typical validation runs:

| Source | Total Games | Expected Valid % | Common Issues |
|--------|-------------|------------------|---------------|
| Poki | ~5,000 | 85-95% | CORS, moved content |
| PlayGama | ~3,000 | 80-90% | Dead links, 404s |
| MockGames | ~500 | 90-95% | Outdated URLs |

## 🔐 Safety Features

1. **Dry Run Mode**: Test without changes
2. **Automatic Backups**: Timestamped originals
3. **Detailed Reports**: Track all changes
4. **Manual Review**: mockGames require manual cleanup
5. **Validation**: Multiple checks per game

## 🤝 Contributing

To add validation for new game sources:

1. Add validation function (e.g., `validateNewSource()`)
2. Extract games from source
3. Call `validateGames(games, 'source-name')`
4. Handle cleanup appropriately
5. Update this README

## 📝 Notes

- Validation uses real HTTP requests, so it requires internet
- Some false positives may occur (games that work in browser but fail validation)
- Always review reports before cleanup
- Keep backups for at least 30 days
- Re-run validation monthly for best results

## 🎮 Integration with Pine

After cleanup, the Pine app will automatically:
- Load cleaned game lists
- Skip broken games
- Provide better user experience
- Faster load times (fewer failed requests)

The changes take effect immediately after restart.

