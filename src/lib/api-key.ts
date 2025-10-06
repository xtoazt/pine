import { sql } from './neon'

// Generate a random API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = 32
  let result = 'pk_'
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Create API key for user
export async function createApiKeyForUser(userId: string): Promise<string> {
  const apiKey = generateApiKey()
  
  try {
    await sql`
      INSERT INTO api_keys (user_id, api_key, created_at)
      VALUES (${userId}, ${apiKey}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        api_key = ${apiKey},
        updated_at = NOW()
    `
    
    return apiKey
  } catch (error) {
    console.error('[api-key] Error creating API key:', error)
    throw error
  }
}

// Verify API key
export async function verifyApiKey(apiKey: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    const result = await sql`
      SELECT user_id, is_active
      FROM api_keys
      WHERE api_key = ${apiKey}
      LIMIT 1
    `
    
    if (result.length === 0) {
      return { valid: false }
    }
    
    const key = result[0]
    if (!key.is_active) {
      return { valid: false }
    }
    
    return { valid: true, userId: key.user_id }
  } catch (error) {
    console.error('[api-key] Error verifying API key:', error)
    return { valid: false }
  }
}

// Get API key for user
export async function getApiKeyForUser(userId: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT api_key
      FROM api_keys
      WHERE user_id = ${userId} AND is_active = true
      LIMIT 1
    `
    
    if (result.length === 0) {
      return null
    }
    
    return result[0].api_key
  } catch (error) {
    console.error('[api-key] Error getting API key:', error)
    return null
  }
}
