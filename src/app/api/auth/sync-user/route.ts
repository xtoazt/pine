import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, displayName, photoUrl } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upsert user
    await sql`
      INSERT INTO users (id, email, display_name, photo_url, updated_at)
      VALUES (${id}, ${email}, ${displayName}, ${photoUrl}, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        email = ${email},
        display_name = ${displayName},
        photo_url = ${photoUrl},
        updated_at = NOW()
    `

    // Create user stats if they don't exist
    await sql`
      INSERT INTO user_stats (user_id)
      VALUES (${id})
      ON CONFLICT (user_id) DO NOTHING
    `

    // Create user profile if it doesn't exist
    await sql`
      INSERT INTO user_profiles (user_id)
      VALUES (${id})
      ON CONFLICT (user_id) DO NOTHING
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[sync-user] Error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
