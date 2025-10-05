# Firebase Setup Guide

This project uses Firebase for authentication and Firestore for database functionality.

## Prerequisites

- A Google/Firebase account
- Node.js and npm installed

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "pine-games")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Save changes

### 3. Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose **production mode** (we'll add security rules next)
4. Select a location closest to your users
5. Click "Enable"

### 4. Configure Firestore Security Rules

In the **Firestore Database** section, go to the **Rules** tab and paste these rules:

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
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.username is string
        && request.resource.data.message is string;
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **Publish** to save the rules.

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Pine Web")
5. Copy the `firebaseConfig` object

### 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Important**: Never commit `.env.local` to version control!

### 7. Install Dependencies

```bash
npm install
```

### 8. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and you should be able to sign up and sign in!

## Features Enabled

✅ **User Authentication** - Username/password (no email required)  
✅ **User Profiles** - Stored in Firestore with stats, achievements, and progress  
✅ **Real-time Chat** - Powered by Firestore real-time listeners  
✅ **Liked Games** - Save favorite games to your profile  
✅ **Progress Syncing** - Level, XP, streak, and achievements sync across devices  

## Firestore Collections

### `users/{userId}`
```typescript
{
  username: string
  createdAt: string
  level: number
  xp: number
  streak: number
  lastPlayedDate: string | null
  gamesPlayed: number
  totalPlayTime: number
  achievements: string[]
  likedGames: string[]
  gameHistory: Array<{
    gameId: string
    playedAt: string
    source: string
    category: string
  }>
}
```

### `messages/{messageId}`
```typescript
{
  username: string
  userId: string
  message: string
  timestamp: Timestamp
}
```

## Troubleshooting

### "Missing or insufficient permissions"
- Make sure you've published the Firestore security rules
- Verify your user is authenticated before accessing protected resources

### "Firebase app not initialized"
- Check that all environment variables in `.env.local` are set correctly
- Make sure you're using `NEXT_PUBLIC_` prefix for client-side variables

### Authentication errors
- Verify Email/Password authentication is enabled in Firebase Console
- Check that your Firebase Auth domain is correct in the environment variables

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all environment variables in your deployment platform's settings
2. Make sure to use the production Firebase project
3. Update security rules if needed for your production domain

## Support

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
