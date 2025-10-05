# Pine - Duolingo-Style Gamification Features

## 🔥 Streak System (Implemented)

### Dedicated Streak Page (`/streak`)
- **Current Streak Display** - Large flame icon with day count
- **Longest Streak Tracking** - Personal best record
- **30-Day Calendar** - Visual representation of activity
- **Streak Milestones** - Unlock rewards at 3, 7, 14, 30, 100, 365 days
- **Dynamic Messages** - Motivational text based on streak length

### Streak Features:
✅ Current streak counter
✅ Longest streak tracker
✅ Visual calendar (last 30 days)
✅ Milestone rewards system
✅ Motivational messages
✅ Color-coded progression (gray → orange → red → purple)

### Planned:
🔜 Streak Freeze (protect from breaks)
🔜 Streak Repair (recover broken streaks)
🔜 Weekend Amulet (weekends don't count)

## 👥 Friends System (Implemented)

### Features:
✅ **Search Users** - Find friends by username
✅ **Friend Requests** - Send and accept requests
✅ **Friends List** - View all your friends
✅ **Friend Stats** - See level, streak, XP
✅ **Real-time Updates** - Firestore listeners

### Friend Page (`/friends`)
- Add friends by username
- Accept pending requests
- View friend profiles
- See friend streaks and levels

### Planned:
🔜 **Direct Messages** - Private chat with friends
🔜 **Friend Streaks** - Compete on weekly XP
🔜 **Friend Leaderboard** - Weekly rankings
🔜 **Challenge Friends** - Custom competitions

## 🏆 Duolingo-Inspired Features

### 1. **XP & Leagues** (Partially Implemented)
- ✅ XP system (10 XP per game)
- ✅ Level progression (100 XP per level)
- ✅ Global leaderboard
- 🔜 Weekly leagues (Bronze, Silver, Gold, etc.)
- 🔜 League promotions/demotions
- 🔜 Top 3 in league earn rewards

### 2. **Daily Goals** (Coming Soon)
- Set daily XP target
- Progress bar showing completion
- Streak bonus for consecutive goal completions
- Achievements for goal streaks

### 3. **Achievements** (Implemented)
- ✅ 13 different achievements
- ✅ Progress tracking
- ✅ Visual unlock animations
- ✅ Achievement toast notifications

### 4. **Streak Freeze** (Coming Soon)
- Earn by completing goals
- Auto-protect streak if you miss a day
- Show freeze count in profile
- Limited quantity (creates urgency)

### 5. **Competition Features**
- Friend leaderboards
- Weekly XP races
- Challenge friends to beat scores
- Collaborative goals

### 6. **Personalization**
- Profile customization
- Avatar selection
- Badge collection
- Custom titles based on achievements

## 📊 Firestore Collections

### `users/{userId}`
```javascript
{
  username: string
  level: number
  xp: number
  streak: number
  longestStreak: number
  lastPlayedDate: string
  gamesPlayed: number
  achievements: string[]
  likedGames: string[]
  streakFreezes: number
  dailyGoal: number
  weeklyXP: number
}
```

### `friendships/{friendshipId}`
```javascript
{
  users: [userId1, userId2]
  status: 'pending' | 'accepted'
  requestedBy: userId
  createdAt: timestamp
}
```

### `messages/{messageId}` (Coming Soon)
```javascript
{
  from: userId
  to: userId
  message: string
  read: boolean
  timestamp: timestamp
}
```

### `leagues/{leagueId}` (Coming Soon)
```javascript
{
  name: 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  users: userId[]
  weekStart: timestamp
  weekEnd: timestamp
}
```

## 🎯 Implementation Roadmap

### Phase 1: Core Features (✅ Completed)
- ✅ Streak tracking
- ✅ XP and levels
- ✅ Achievements
- ✅ Friends system
- ✅ Global leaderboard

### Phase 2: Social Features (In Progress)
- 🔜 Direct messages
- 🔜 Friend streak competitions
- 🔜 Friend challenges
- 🔜 Share achievements

### Phase 3: Gamification Enhancement
- 🔜 Daily goals
- 🔜 Streak freeze/repair
- 🔜 Weekly leagues
- 🔜 XP competitions
- 🔜 Rewards shop

### Phase 4: Advanced Features
- 🔜 Custom avatars
- 🔜 Profile badges
- 🔜 Achievement showcase
- 🔜 Monthly tournaments
- 🔜 Clan/team system

## 💡 Duolingo-Style UX Patterns

### Visual Design:
- ✅ Bright, colorful cards
- ✅ Emoji icons for quick recognition
- ✅ Progress bars everywhere
- ✅ Celebration animations
- 🔜 Confetti on achievements
- 🔜 Sound effects for actions

### Psychological Triggers:
- ✅ Loss aversion (streak protection)
- ✅ Social proof (leaderboards)
- ✅ Achievement unlocking (dopamine)
- ✅ Progress visualization
- 🔜 FOMO (limited-time events)
- 🔜 Competition (friend races)

### Engagement Loops:
1. **Daily Loop**
   - Check streak → Play games → Earn XP → Complete goal
2. **Weekly Loop**
   - Check league position → Compete for XP → Move up ranks
3. **Social Loop**
   - Check friends → Compare progress → Challenge/message

## 🎮 User Journey

### New User:
```
1. Sign up
2. Play first game (+10 XP, unlock achievement)
3. See streak start (Day 1)
4. Add friends
5. Set daily goal
6. Join Bronze league
```

### Returning User:
```
1. Check streak (maintain or increase)
2. View friend activity
3. Check league position
4. Complete daily goal
5. Earn XP
6. Unlock achievements
```

### Engaged User:
```
1. Maintain long streak (30+ days)
2. Compete in Gold league
3. Challenge friends
4. Share achievements
5. Help friends with goals
6. Unlock exclusive rewards
```

## 📈 Metrics to Track

### Engagement:
- Daily active users (DAU)
- Streak maintenance rate
- Average session length
- Games per session

### Social:
- Friend requests sent/accepted
- Messages sent
- Friend challenges completed
- Leaderboard check frequency

### Gamification:
- Achievement unlock rate
- Streak freeze usage
- Daily goal completion rate
- League progression

Built with ❤️ inspired by Duolingo's addictive design!
