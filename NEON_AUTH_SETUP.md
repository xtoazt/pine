# Neon Auth Setup Guide

Pine uses **Neon Auth**, which is Neon's built-in authentication powered by Stack Auth.

## What is Neon Auth?

Neon Auth is Neon's integrated authentication solution that:
- Provides built-in user authentication
- Manages user sessions
- Stores user data in your Neon database
- Uses Stack Auth as the underlying authentication provider

## Setup Instructions

### 1. Enable Neon Auth in Your Neon Project

1. Go to your Neon Console: https://console.neon.tech
2. Select your project
3. Navigate to **Auth & access** → **Neon Auth**
4. Click **Set up Auth**
5. Copy the provided environment variables

### 2. Add Environment Variables to Vercel

Add these environment variables to your Vercel project:

```bash
# Neon Auth (Stack Auth) Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Neon Database
DATABASE_URL=your_neon_connection_string
```

### 3. Local Development

Create a `.env.local` file in the project root:

```bash
# Neon Auth (Stack Auth) Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Neon Database
DATABASE_URL=your_neon_connection_string
```

**Important:** Never commit `.env.local` to git (it's already in `.gitignore`)

### 4. Initialize Database Tables

Run the database initialization script:

```bash
npm run init-db
```

This creates the necessary tables:
- `users` - User accounts
- `user_stats` - Game statistics
- `user_profiles` - User profiles
- `friendships` - Friend relationships
- `messages` - Direct messages
- `api_keys` - API keys for game access

### 5. Test Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Sign Up" in the header

4. Create a test account

5. Verify you can:
   - Sign in/out
   - Access your API key at `/api-key`
   - View your stats
   - Play games

## Features Enabled by Neon Auth

Once configured, users get:

✅ **Authentication**
- Sign up / Sign in
- Session management
- Secure logout

✅ **API Keys**
- Free API key on signup
- Access to 20,000+ games
- Key management at `/api-key`

✅ **User Data**
- Game statistics
- Achievement tracking
- Play history
- Friend system (coming soon)

✅ **Database Integration**
- All data stored in Neon
- Fast queries
- Automatic backups

## Troubleshooting

### Build Fails Without Env Vars

Pine is designed to build successfully even without Neon Auth configured. If you see build errors:

1. Check that all imports are conditional
2. Verify `isStackConfigured` checks are in place
3. Ensure dynamic imports are used for auth routes

### Authentication Not Working

1. Verify all environment variables are set correctly
2. Check that `DATABASE_URL` is accessible
3. Run `npm run init-db` to create tables
4. Clear browser cache and cookies
5. Check Vercel deployment logs for errors

### API Keys Not Generated

1. Ensure `api_keys` table exists in database
2. Check `/api/auth/sync-user` route is working
3. Verify user sync happens on signup
4. Check browser console for errors

## Architecture

```
User Signs Up
    ↓
Neon Auth (Stack Auth) creates user
    ↓
/api/auth/sync-user syncs to Neon DB
    ↓
API key generated automatically
    ↓
User can access games
```

## Resources

- [Neon Auth Documentation](https://neon.tech/docs/guides/neon-auth)
- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Neon Console](https://console.neon.tech)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test locally with `.env.local` first
4. Check Neon console for database connectivity
