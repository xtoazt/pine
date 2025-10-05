# Pine - Real Stats & Firebase Integration

## 🔥 Firebase Configuration

### Production Firebase Project
- **Project**: pine-744dd
- **Database**: Firestore
- **Authentication**: Email/Password (username-based)
- **Analytics**: Google Analytics enabled

### Configuration Implemented
```javascript
{
  apiKey: "AIzaSyDtaYf6FLsPL9FsTqFEE6lJlxPepxnSOKg",
  authDomain: "pine-744dd.firebaseapp.com",
  projectId: "pine-744dd",
  storageBucket: "pine-744dd.firebasestorage.app",
  messagingSenderId: "266139672867",
  appId: "1:266139672867:web:2c6215cc3661d9652bac96",
  measurementId: "G-PHTMKDR4B0"
}
```

## 📊 Real Stats System

### Stats Page Features

#### 1. **Global Statistics** (Top Cards)
- 👥 **Total Players** - Number of registered users
- 🎯 **Games Played** - Sum of all games played by all users
- 🏆 **Achievements** - Total achievements unlocked across all users
- 🔥 **Longest Streak** - Highest streak among all players
- 👑 **Highest Level** - Maximum level achieved

#### 2. **Personal Stats**
- Level and XP progress
- Games played
- Current streak
- Achievements unlocked
- Sources played
- Categories explored

#### 3. **Leaderboard** (Top 10 Players)
Displays:
- 🥇 🥈 🥉 Medals for top 3 players
- Username
- Level and XP
- Games played
- Achievements count
- Current streak
- Highlights current user with "You" badge

## 🔄 Data Flow

### For Authenticated Users:
1. **Stats stored in Firestore** under `/users/{userId}`
2. **Real-time sync** - Changes appear instantly
3. **Persistent across devices** - Sign in anywhere
4. **Leaderboard ranking** - Compete with others

### For Guest Users:
1. **Stats stored in localStorage**
2. **Local only** - Not synced
3. **Not on leaderboard** - Must sign in to compete
4. **Can be migrated** - Sign up to save progress

## 📈 Stats Tracking

### Automatic Tracking:
- ✅ Games played count
- ✅ Unique games played
- ✅ XP and level progression
- ✅ Daily login streak
- ✅ Achievement unlocks
- ✅ Sources explored
- ✅ Categories played
- ✅ Night owl status (plays between 12am-6am)

### Manual Tracking:
- ❤️ Liked games (via heart button)
- 📜 Game history (last 100 games)

## 🏆 Achievement System

### Real Achievements (Firestore-backed):
1. **First Steps** - Play your first game
2. **Getting Started** - Play 5 games
3. **Casual Gamer** - Play 10 games
4. **Dedicated Player** - Play 25 games
5. **Gaming Legend** - Play 50 games
6. **Completionist** - Play 100 games
7. **Explorer** - Try 3 different sources
8. **Source Master** - Try 5 different sources
9. **Variety Lover** - Play 5 different categories
10. **Night Owl** - Play between 12am-6am
11. **Streak Starter** - Maintain 3 day streak
12. **Streak Master** - Maintain 7 day streak
13. **Favorites** - Like 5 games

### Progress Tracking:
- Current progress vs. max progress
- Visual progress bars
- Unlock notifications
- Toast notifications on unlock

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read messages, but only authenticated users can write
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📡 API Endpoints

### `/api/stats?type=leaderboard`
Returns top 100 players sorted by level and XP:
```json
{
  "leaderboard": [
    {
      "username": "player1",
      "level": 10,
      "xp": 500,
      "gamesPlayed": 150,
      "streak": 7,
      "achievements": 8
    }
  ]
}
```

### `/api/stats?type=global`
Returns global statistics:
```json
{
  "totalUsers": 150,
  "totalGamesPlayed": 5000,
  "totalAchievements": 450,
  "highestStreak": 21,
  "highestLevel": 15
}
```

## 🎮 User Experience

### For New Users:
1. Play as guest with localStorage
2. See "Sign in to compete" message
3. Create account to sync progress
4. Immediately appear on leaderboard

### For Authenticated Users:
1. All stats sync to Firestore
2. Real-time leaderboard updates
3. Progress saved across devices
4. Compete for top positions

## 🚀 Performance

- ✅ **Real-time updates** using Firestore listeners
- ✅ **Efficient queries** with Firestore indexes
- ✅ **Caching** for leaderboard and global stats
- ✅ **Background loading** for stats page
- ✅ **No blocking** - Stats load while page renders

## 📝 Implementation Details

### Stats Sync:
- `useGameStats` hook manages stats
- Detects authenticated vs. guest user
- Auto-syncs to Firestore or localStorage
- Real-time listeners for live updates

### Leaderboard:
- Fetches on page load
- Shows top 10 players
- Highlights current user
- Auto-updates on refresh

### Global Stats:
- Aggregated from all users
- Cached for performance
- Updates every page load
- Shows platform-wide activity

Built with ❤️ using Firebase, Firestore, and Next.js
