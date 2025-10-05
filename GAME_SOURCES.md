# Pine Game Sources

This document outlines all game sources integrated into pine and their current status.

## ✅ Active Game Sources

### 1. **Lessons** (Static)
- **Source**: gn-math repository / math-lessons-monster
- **Type**: Static games included in `mockGames`
- **ID Pattern**: `lesson-*` (e.g., `lesson-1`, `lesson-89`)
- **Play URL**: `/api/proxy/lessons/[id]`
- **Status**: ✅ **WORKING**
- **Count**: ~460 games
- **Description**: Educational math games from the gn-math repository

### 2. **HDUN Curated** (Proxied)
- **Source**: HDUN platform (hdun.org)
- **Type**: Static curated list with dynamic proxy
- **ID Pattern**: `hdun-*` (e.g., `hdun-action-1`)
- **Play URL**: `/api/hdun/proxy?id={slug}` (e.g., `/api/hdun/proxy?id=supermariobros`)
- **Status**: ✅ **WORKING** (URLs fixed)
- **Count**: 417 curated games
- **Description**: Curated HTML5 games from HDUN platform, proxied through pine

### 3. **Fortnite Games** (Static)
- **Source**: fortnite-game.github.io
- **Type**: Static games included in `mockGames`
- **ID Pattern**: `class-*` (e.g., `class-406`)
- **Play URL**: Various (GitHub hosted)
- **Status**: ✅ **WORKING**
- **Count**: ~50 games
- **Description**: Popular unblocked games collection

### 4. **HTML5 Games** (Static)
- **Source**: tw31122007/HTML-Games-V2 repository
- **Type**: Static games included in `mockGames`
- **ID Pattern**: Various (e.g., `simulation-tycoon`, `idle-incremental`)
- **Play URL**: `/play/{id}`
- **Status**: ✅ **WORKING**
- **Count**: ~50 games
- **Description**: HTML5 games from GitHub repository

### 5. **Radon Games** (Dynamic)
- **Source**: Radon-Games GitHub repository
- **Type**: Dynamically fetched via `/api/radon/games`
- **ID Pattern**: `radon-*`
- **Play URL**: `/api/ds/proxy?url={encodedUrl}`
- **Status**: ⚠️ **ENABLED** (fetched on every request)
- **Count**: Variable (depends on Radon API)
- **Description**: Dynamic game collection via GitHub

### 6. **GameSnacks** (Proxied)
- **Source**: gamesnacks.com
- **Type**: Dynamically fetched via sitemap scraping
- **ID Pattern**: `gs-*`
- **Play URL**: `/api/ds/proxy?url=https://gamesnacks.com/games/{id}`
- **Status**: ⚠️ **ENABLED** (fetched on every request, with ping filtering)
- **Count**: Variable (filtered by availability)
- **Description**: Mobile-optimized HTML5 games

### 7. **HDUN Dynamic** (Proxied)
- **Source**: HDUN platform (hdun.org)
- **Type**: Dynamically fetched via `/api/hdun/list`
- **ID Pattern**: `hdun-{slug}`
- **Play URL**: `/api/hdun/proxy?id={slug}`
- **Status**: ⚠️ **ENABLED** (fetched on every request, with ping filtering)
- **Count**: Variable (filtered by availability)
- **Description**: Additional HDUN games discovered via scraping

### 8. **gn-math** (Dynamic)
- **Source**: gn-math/html GitHub repository
- **Type**: Dynamically fetched via `/api/gnmath/list`
- **ID Pattern**: `gnmath-*`
- **Play URL**: `/api/ds/proxy?url={encodedUrl}`
- **Status**: ⚠️ **ENABLED** (fetched on every request)
- **Count**: Variable
- **Description**: Math games from gn-math repository

### 9. **s16.lol** (API)
- **Source**: s16.lol API
- **Type**: Dynamically fetched via s16.lol search API
- **ID Pattern**: `s16-*`
- **Play URL**: From s16 API response
- **Status**: ⚠️ **ENABLED** (fetched on every request)
- **Count**: Variable (seeded queries fetch ~100+ games)
- **Description**: Large game API with 20,000+ titles

## 🔧 API Configuration

### Default Behavior (as of latest update)
- **All sources are now fetched by default** on every API request
- External sources (Radon, GameSnacks, HDUN Dynamic, gn-math, s16) are fetched in parallel using `Promise.all()`
- Static sources (Lessons, HDUN Curated, Fortnite, HTML5) are always included from `mockGames`

### Query Parameters
- `?source={name}` - Filter by specific source (e.g., `?source=lessons`)
- `?limit={n}` - Limit number of results (default: 50)
- `?offset={n}` - Pagination offset (default: 0)
- `?category={cat}` - Filter by category
- `?search={query}` - Search games
- `?verify=true` - Enable ping verification (slower, more accurate)
- `?all=true` - Return all games without pagination
- `?api_key={key}` - API key for unlimited access

## 📊 Total Game Count

### Static Sources (Always Available)
- Lessons: ~460 games
- HDUN Curated: 417 games
- Fortnite: ~50 games
- HTML5: ~50 games
- **Total Static: ~977 games**

### Dynamic Sources (Fetched on Request)
- Radon: Variable
- GameSnacks: Variable (filtered)
- HDUN Dynamic: Variable (filtered)
- gn-math: Variable
- s16.lol: Variable (~100+ per request)
- **Total Dynamic: Variable (potentially thousands)**

### Grand Total
**~1,000+ games** with potential for thousands more from dynamic sources.

## 🚀 Performance Considerations

### Fast Sources (< 1 second)
- Lessons (static)
- HDUN Curated (static)
- Fortnite (static)
- HTML5 (static)

### Slower Sources (1-5 seconds)
- Radon Games (GitHub API)
- gn-math (GitHub API)

### Very Slow Sources (5+ seconds)
- GameSnacks (sitemap scraping + ping filtering)
- HDUN Dynamic (scraping + ping filtering)
- s16.lol (multiple API queries)

### Optimization Strategy
- All external sources are fetched in parallel using `Promise.all()`
- Ping filtering is optional (disabled by default)
- Results are cached at the HTTP level where possible

## 🔍 Verification

To verify all sources are working:

1. **Check API response**: `GET /api/games?limit=100`
2. **Check source distribution**: Visit `/developer` → Sources tab
3. **Test individual sources**: `GET /api/games?source={name}&limit=10`
4. **Verify game counts**: Check Developer Mode dashboard

## 📝 Notes

- Some dynamic sources may return empty arrays if external APIs are down
- Ping filtering (when enabled) can significantly reduce game counts but improves reliability
- The total game count displayed to users reflects all available games from all sources
- Games are deduplicated by ID to prevent duplicates across sources
