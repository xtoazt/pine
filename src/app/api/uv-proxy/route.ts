import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }
  
  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url)
    
    // Fetch the content
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    
    const content = await response.text()
    
    // Return with CORS headers
    return new NextResponse(content, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }
  
  try {
    const body = await request.text()
    const decodedUrl = decodeURIComponent(url)
    
    const response = await fetch(decodedUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body,
    })
    
    const content = await response.text()
    
    return new NextResponse(content, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error.message },
      { status: 500 }
    )
  }
}
