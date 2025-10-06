import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const res = await fetch(url, { redirect: 'follow' })
    const headers = new Headers(res.headers)
    // Relax CORS for our app
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Headers', '*')
    headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS')
    return new NextResponse(res.body, { status: res.status, headers })
  } catch (e) {
    return NextResponse.json({ error: 'Mirror failure' }, { status: 502 })
  }
}


