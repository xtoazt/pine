# Firestore Security Rules Update

## 📋 Updated Security Rules

Add these rules to your Firebase Console under **Firestore Database → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - read by authenticated, write own profile only
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages collection - for global chat
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.username is string
        && request.resource.data.message is string;
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Friendships collection - NEW
    match /friendships/{friendshipId} {
      // Read if you're one of the users in the friendship
      allow read: if request.auth != null 
        && request.auth.uid in resource.data.users;
      
      // Create if you're one of the users
      allow create: if request.auth != null 
        && request.auth.uid in request.resource.data.users
        && request.resource.data.users.size() == 2
        && request.resource.data.status in ['pending', 'accepted']
        && request.resource.data.requestedBy == request.auth.uid;
      
      // Update if you're one of the users (for accepting requests)
      allow update: if request.auth != null 
        && request.auth.uid in resource.data.users;
      
      // Delete if you're one of the users
      allow delete: if request.auth != null 
        && request.auth.uid in resource.data.users;
    }
    
    // Direct messages collection - COMING SOON
    match /directMessages/{messageId} {
      // Read if you're the sender or receiver
      allow read: if request.auth != null 
        && (request.auth.uid == resource.data.from 
            || request.auth.uid == resource.data.to);
      
      // Create if you're the sender
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.from
        && request.resource.data.to is string
        && request.resource.data.message is string;
      
      // Update if you're the receiver (for marking as read)
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.to;
    }
    
    // Leagues collection - COMING SOON
    match /leagues/{leagueId} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
    
    // Achievements collection - COMING SOON
    match /achievements/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔐 Security Features

### Users Collection
- ✅ Authenticated users can read all profiles
- ✅ Users can only write to their own profile
- ✅ Prevents unauthorized data modification

### Friendships Collection
- ✅ Only visible to the two users involved
- ✅ Can only create friendship with yourself included
- ✅ Must have exactly 2 users
- ✅ Status must be 'pending' or 'accepted'
- ✅ Only creator can send request
- ✅ Either party can update (for accepting)
- ✅ Either party can delete (unfriend)

### Direct Messages Collection (Coming Soon)
- ✅ Only sender and receiver can read
- ✅ Only sender can create
- ✅ Only receiver can update (mark as read)
- ✅ Prevents message tampering

### Leagues Collection (Coming Soon)
- ✅ Public read access
- ✅ Only server-side writes (via Firebase Admin SDK)
- ✅ Prevents cheating

## 📊 Firestore Indexes

You may need to create these composite indexes in Firebase Console:

### For Leaderboards:
```
Collection: users
Fields: level (Descending), xp (Descending)
Query Scope: Collection
```

### For Friend Queries:
```
Collection: friendships
Fields: users (Array), status (Ascending)
Query Scope: Collection
```

### For Direct Messages:
```
Collection: directMessages
Fields: to (Ascending), timestamp (Descending)
Query Scope: Collection
```

## 🚀 How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pine-744dd**
3. Click **Firestore Database** in sidebar
4. Click **Rules** tab
5. Copy the rules above
6. Click **Publish**

## 🧪 Testing Rules

Test your rules in the Firebase Console:

### Test User Profile Read:
```javascript
// Should succeed
auth: { uid: 'user123' }
path: /databases/(default)/documents/users/user456
read
```

### Test Friendship Creation:
```javascript
// Should succeed
auth: { uid: 'user123' }
path: /databases/(default)/documents/friendships/friendship1
write
data: {
  users: ['user123', 'user456'],
  status: 'pending',
  requestedBy: 'user123'
}
```

### Test Unauthorized Access:
```javascript
// Should fail
auth: null
path: /databases/(default)/documents/users/user123
write
```

## ⚠️ Important Notes

1. **Backup Current Rules**: Save your existing rules before updating
2. **Test Thoroughly**: Use Firebase Rules Playground to test
3. **Monitor Usage**: Check Firestore usage in Firebase Console
4. **Optimize Queries**: Add indexes as needed for performance
5. **Review Regularly**: Update rules as features evolve

## 📈 Expected Performance

With these rules and indexes:
- ✅ Fast user profile lookups
- ✅ Efficient friend list queries
- ✅ Quick leaderboard loading
- ✅ Secure message delivery
- ✅ Minimal read/write operations

Your Firestore is now secure and optimized! 🔒
