# Pine - User Accounts & Firebase Setup

Pine now has full user account functionality with Firebase/Firestore!

## 🎉 What's New

### User Accounts
- **Sign Up/Sign In** - Username and password only (no email required!)
- **User Profiles** - Stored in Firestore with all game progress
- **Progress Syncing** - Level, XP, streak, achievements sync across devices
- **Guest Mode** - Works without account using localStorage

### Features
- ✅ **Liked Games** - Heart button on game pages to save favorites
- ✅ **Real-time Chat** - Firestore-powered chat (replaced socket.io)
- ✅ **Persistent Stats** - All achievements and progress saved to cloud
- ✅ **User Dropdown** - Header shows username with profile menu
- ✅ **Sign Out** - Clean logout with data preservation

### Removed
- ❌ Socket.io chat (replaced with Firestore)
- ❌ Email requirement (username only)
- ❌ Old chat components

## 🔧 Setup Instructions

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Set up Firebase:**
   - Read `FIREBASE_SETUP.md` for detailed instructions
   - Create a Firebase project
   - Enable Email/Password authentication
   - Create Firestore database
   - Add security rules
   - Copy config to `.env.local`

3. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

## 📁 New Files

- `src/lib/firebase.ts` - Firebase initialization
- `src/contexts/auth-context.tsx` - Authentication provider
- `src/hooks/useUserProfile.ts` - User profile management
- `src/components/auth/auth-modal.tsx` - Login/signup modal
- `src/components/game/like-button.tsx` - Like game functionality
- `src/app/chat/page.tsx` - New Firestore chat page
- `src/components/ui/dialog.tsx` - Dialog component
- `src/components/ui/scroll-area.tsx` - Scroll area component
- `src/components/ui/tabs.tsx` - Tabs component
- `src/components/ui/label.tsx` - Label component
- `src/components/ui/dropdown-menu.tsx` - Dropdown menu component

## 🔥 Firestore Collections

### `users/{userId}`
Stores user profiles with:
- username, level, XP, streak
- gamesPlayed, achievements
- likedGames array
- gameHistory array

### `messages/{messageId}`
Stores chat messages with:
- username, userId, message
- timestamp

## 🎮 How It Works

1. **Guest Experience**: Users can play without account, data stored in localStorage
2. **Sign Up**: Click "Sign In" button → Create account with username + password
3. **Auto-Sync**: All progress automatically syncs to Firestore
4. **Cross-Device**: Sign in on any device to access your progress
5. **Like Games**: Heart button appears when signed in
6. **Chat**: Real-time chat available on `/chat` page

## 🛡️ Security

- Firestore security rules enforce user data access
- Users can only read/write their own profile
- Messages are public read, authenticated write only
- No email stored (username acts as identifier)

## 🚀 Deployment

When deploying, make sure to:
1. Set all Firebase environment variables in your hosting platform
2. Use production Firebase project
3. Update security rules if needed

Built with ❤️ using Firebase, Firestore, and Next.js
