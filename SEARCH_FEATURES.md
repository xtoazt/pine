# Pine - Search Features Guide

## 🔍 Search Capabilities

Pine now has **multiple ways to search** for games, each designed for different use cases.

## 1. Regular Search (Default)

### How to Use:
- Type any game name, keyword, or description
- Press Enter or click search
- Searches across: titles, descriptions, and tags

### Examples:
```
mario
puzzle games
adventure
shooting
```

### Where:
- Header search bar
- Games page search
- Search page (`/search?q=your+query`)

## 2. @Source Filtering (Additional Feature)

### How to Use:
- Start your search with `@sourcename`
- Optionally add keywords after the source
- Works alongside regular search

### Examples:
```
@s16                    → All s16 games
@gamesnacks             → All GameSnacks games
@s16 mario              → Mario games from s16 only
@radon shooting         → Shooting games from Radon
@gnmath puzzle          → Puzzle games from gn-math
```

### Supported Sources:
- `@s16` or `@s16lol` - 20,000+ games
- `@gamesnacks` - 500+ games
- `@gnmath` or `@gn-math` - 300+ games
- `@radon` - 300+ games
- `@classwork` - 100+ games
- `@arcade` - 150+ games
- `@lessons` - 600+ games
- `@fortnite` - 50+ games

### Visual Feedback:
- Badge appears showing "Filtering by source: X"
- Available on games page and search page
- Updates in real-time

## 3. URL-Based Filtering

### Direct Links:
```
/games?source=s16
/games?source=gamesnacks
/games?source=radon
```

### Use Cases:
- Share filtered views
- Bookmark specific sources
- Create custom links

## 4. Hover to See Source

### How It Works:
- Hover over any game card
- Source badge appears in top-right corner
- Shows game's origin (s16, GameSnacks, etc.)
- Animates smoothly on hover

### Visual Design:
- Subtle badge with shadow
- Appears only on hover
- Non-intrusive design
- Consistent across all pages

## 🎯 Search Flow

### Regular Search:
```
User types: "mario"
    ↓
Searches all sources
    ↓
Returns matching games from everywhere
    ↓
Shows results
```

### @Source Search:
```
User types: "@s16 mario"
    ↓
Filters to s16 source only
    ↓
Searches "mario" within s16
    ↓
Returns only s16 games matching "mario"
    ↓
Shows results with source badge
```

## 📍 Where Search Works

### 1. Header Search Bar
- Available on all pages
- Quick access
- Supports both regular and @ searches
- Shows placeholder: "Search... (Try @s16)"

### 2. Games Page Search
- Dedicated search input
- Real-time filtering
- Shows source badge when using @
- Placeholder: "Search games... (Try @s16 or @gamesnacks)"

### 3. Search Results Page (`/search`)
- Full search results
- Handles both search types
- Shows query and source filter
- Background loading for external sources

## 💡 Pro Tips

### Combine Features:
1. **Browse by Source** on homepage → Click source card
2. **Hover to verify** → Check source before playing
3. **Use @ for precision** → Find exactly what you want
4. **Regular search for discovery** → Find games across all sources

### Best Practices:
- Use regular search when exploring
- Use @ search when you know the source
- Hover to verify game sources
- Click source cards on homepage for full source view

## 🔄 How It All Works Together

```
Homepage
    ↓
Browse by Source cards → /games?source=X
    ↓
Game cards show source on hover
    ↓
Search bar accepts @ syntax
    ↓
Results filtered by source + search term
```

## 🎮 Examples in Practice

### Scenario 1: Finding s16 Games
```
Option A: Search "@s16" in header
Option B: Click "s16.lol" card on homepage
Option C: Go to /games?source=s16
```

### Scenario 2: Specific Game from Source
```
Search: "@gamesnacks puzzle"
Result: Only puzzle games from GameSnacks
```

### Scenario 3: General Search
```
Search: "mario"
Result: All Mario games from all sources
Hover: See which source each game is from
```

## ✨ Features Summary

✅ Regular search (default)  
✅ @source filtering (additional)  
✅ Hover to see source (visual feedback)  
✅ URL-based filtering (shareable)  
✅ Real-time updates  
✅ Background loading  
✅ Multiple entry points  
✅ Consistent UX across pages  

Search however you want - Pine adapts to your needs! 🎯
