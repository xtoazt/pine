import { sql } from '@/lib/neon'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export interface User {
  id: string
  email: string
  displayName: string
  photoURL: string | null
  createdAt: Date
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create JWT token
export async function createToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)
  
  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch (error) {
    return null
  }
}

// Sign up user
export async function signUpUser(email: string, password: string, displayName: string): Promise<User> {
  // Check if user exists
  const existing = await sql`
    SELECT id FROM users WHERE email = ${email}
  `
  
  if (existing.length > 0) {
    throw new Error('User already exists')
  }
  
  // Hash password
  const passwordHash = await hashPassword(password)
  
  // Create user
  const result = await sql`
    INSERT INTO users (email, password_hash, display_name, created_at, updated_at)
    VALUES (${email}, ${passwordHash}, ${displayName}, NOW(), NOW())
    RETURNING id, email, display_name, photo_url, created_at
  `
  
  const user = result[0]
  
  // Create user stats
  await sql`
    INSERT INTO user_stats (user_id)
    VALUES (${user.id})
    ON CONFLICT (user_id) DO NOTHING
  `
  
  // Create user profile
  await sql`
    INSERT INTO user_profiles (user_id)
    VALUES (${user.id})
    ON CONFLICT (user_id) DO NOTHING
  `
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    photoURL: user.photo_url,
    createdAt: user.created_at,
  }
}

// Sign in user
export async function signInUser(email: string, password: string): Promise<User> {
  const result = await sql`
    SELECT id, email, password_hash, display_name, photo_url, created_at
    FROM users
    WHERE email = ${email}
  `
  
  if (result.length === 0) {
    throw new Error('Invalid email or password')
  }
  
  const user = result[0]
  
  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)
  
  if (!isValid) {
    throw new Error('Invalid email or password')
  }
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    photoURL: user.photo_url,
    createdAt: user.created_at,
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, display_name, photo_url, created_at
    FROM users
    WHERE id = ${userId}
  `
  
  if (result.length === 0) {
    return null
  }
  
  const user = result[0]
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    photoURL: user.photo_url,
    createdAt: user.created_at,
  }
}
