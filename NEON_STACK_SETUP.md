# Neon + Stack Auth Setup

Pine now uses **Neon** for the database and **Stack Auth** for authentication.

## 🗄️ Database: Neon

Neon is a serverless Postgres database that provides:
- ✅ Serverless Postgres with autoscaling
- ✅ Instant branching for development
- ✅ Built-in connection pooling
- ✅ Free tier with 0.5 GB storage

### Database Schema

The following tables are automatically created:

1. **users** - User accounts
   - `id` (TEXT, PRIMARY KEY)
   - `email` (TEXT, UNIQUE)
   - `display_name` (TEXT)
   - `photo_url` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **user_stats** - User gaming statistics
   - `user_id` (TEXT, PRIMARY KEY, FK to users)
   - `total_play_time` (INTEGER)
   - `games_played` (INTEGER)
   - `achievements` (JSONB)
   - `streak_days` (INTEGER)
   - `last_play_date` (TIMESTAMP)

3. **user_profiles** - User profile data
   - `user_id` (TEXT, PRIMARY KEY, FK to users)
   - `bio` (TEXT)
   - `favorite_games` (JSONB)
   - `settings` (JSONB)

4. **friendships** - User friendships
   - `id` (SERIAL, PRIMARY KEY)
   - `user_id`, `friend_id` (TEXT, FK to users)
   - `status` (TEXT) - 'pending', 'accepted', 'rejected'

5. **messages** - Direct messages
   - `id` (SERIAL, PRIMARY KEY)
   - `from_user_id`, `to_user_id` (TEXT, FK to users)
   - `message` (TEXT)
   - `read` (BOOLEAN)
   - `created_at` (TIMESTAMP)

### Initialize Database

Run the initialization script to create all tables:

\`\`\`bash
npx tsx scripts/init-db.ts
\`\`\`

## 🔐 Authentication: Stack Auth

Stack Auth provides:
- ✅ Built-in authentication UI components
- ✅ Email/password authentication
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Session management
- ✅ User management dashboard

### Stack Auth Dashboard

Access your Stack Auth dashboard at:
**https://app.stack-auth.com/projects/73feec20-8ea2-4bee-812a-2cf3e5de1a50**

### Environment Variables

The following environment variables are configured in `.env.local`:

\`\`\`env
# Neon Auth environment variables
NEXT_PUBLIC_STACK_PROJECT_ID='73feec20-8ea2-4bee-812a-2cf3e5de1a50'
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY='pck_j2ddvtvypgj8sbvbn351fdk4320wh51g6eazmy51sy7v8'
STACK_SECRET_SERVER_KEY='ssk_10fgh9qk7v0597q6g5bfsfz73w7t03wqrcbx5sc7wysy0'

# Database connection string
DATABASE_URL='postgresql://neondb_owner:npg_rbyaFXK8Y6HR@ep-dark-glade-adqsw3sa-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
\`\`\`

## 🚀 Usage

### Authentication

Stack Auth automatically handles authentication. Users are synced to the Neon database when they sign in.

### Using the Auth Context

\`\`\`tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not signed in</div>
  
  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
\`\`\`

### Querying the Database

\`\`\`tsx
import { sql } from '@/lib/neon'

// Get user stats
const stats = await sql\`
  SELECT * FROM user_stats WHERE user_id = \${userId}
\`

// Update user stats
await sql\`
  UPDATE user_stats 
  SET games_played = games_played + 1,
      total_play_time = total_play_time + \${playTime}
  WHERE user_id = \${userId}
\`
\`\`\`

## 📚 Resources

- **Neon Documentation**: https://neon.tech/docs
- **Stack Auth Documentation**: https://docs.stack-auth.com
- **Stack Auth JWKS**: https://api.stack-auth.com/api/v1/projects/73feec20-8ea2-4bee-812a-2cf3e5de1a50/.well-known/jwks.json

## 🔄 Migration from Firebase

All Firebase code has been removed and replaced with:
- ✅ Neon for database operations
- ✅ Stack Auth for authentication
- ✅ User data automatically synced to Neon database
- ✅ All existing features preserved

## ⚠️ Important Notes

1. **First Run**: Run `npx tsx scripts/init-db.ts` to initialize the database
2. **Stack Auth UI**: Authentication now uses Stack Auth's built-in UI components
3. **User Sync**: Users are automatically synced to Neon when they sign in
4. **Security**: Never commit `.env.local` to version control
