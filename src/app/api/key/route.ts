import { NextRequest, NextResponse } from 'next/server'

// Mock API key generation - in production, this would be more secure
function generateApiKey(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  return `pine_${timestamp}_${random}`
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = generateApiKey()
    
    return NextResponse.json({
      apiKey,
      message: 'API key generated successfully',
      usage: {
        description: 'Use this API key to access all games and remove rate limits',
        example: `https://pine-games.vercel.app/api/games?api_key=${apiKey}`,
        header: `X-API-Key: ${apiKey}`,
        note: 'API key is optional but recommended for production use'
      },
      limits: {
        withoutKey: '50 games per request',
        withKey: 'All games, no limits'
      }
    })
  } catch (error) {
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, purpose } = body
    
    const apiKey = generateApiKey()
    
    // In production, you would store this in a database
    console.log(`New API key generated for: ${name} (${email}) - Purpose: ${purpose}`)
    
    return NextResponse.json({
      apiKey,
      message: 'API key generated successfully',
      user: {
        name,
        email,
        purpose
      },
      usage: {
        description: 'Use this API key to access all games and remove rate limits',
        example: `https://pine-games.vercel.app/api/games?api_key=${apiKey}`,
        header: `X-API-Key: ${apiKey}`,
        note: 'API key is optional but recommended for production use'
      }
    })
  } catch (error) {
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}
