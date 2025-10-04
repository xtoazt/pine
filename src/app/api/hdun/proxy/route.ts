import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('id')
    const path = searchParams.get('path') || ''
    
    if (!gameId) {
      return NextResponse.json({ error: 'Game ID required' }, { status: 400 })
    }
    
    // Construct the HDUN game URL
    const baseUrl = `https://www.hdun.org/games/alotofgames/${gameId}`
    const targetUrl = path ? `${baseUrl}/${path}` : `${baseUrl}/`
    
    // Fetch the game content
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
    
    const contentType = response.headers.get('content-type') || 'text/html'
    const content = await response.text()
    
    // Modify the content to work with pine's proxy
    let modifiedContent = content
    
    // Replace relative URLs with proxy URLs
    modifiedContent = modifiedContent.replace(
      /src="([^"]*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))"/g,
      (match, url) => {
        if (url.startsWith('http')) return match
        const proxyUrl = `/api/hdun/proxy?id=${gameId}&path=${encodeURIComponent(url)}`
        return `src="${proxyUrl}"`
      }
    )
    
    modifiedContent = modifiedContent.replace(
      /href="([^"]*\.(css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))"/g,
      (match, url) => {
        if (url.startsWith('http')) return match
        const proxyUrl = `/api/hdun/proxy?id=${gameId}&path=${encodeURIComponent(url)}`
        return `href="${proxyUrl}"`
      }
    )
    
    // Add pine styling and controls
    const pineControls = `
      <div id="pine-controls" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-family: Arial, sans-serif;">
        <button onclick="window.parent.postMessage({type: 'pine-fullscreen'}, '*')" style="background: #007bff; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Fullscreen</button>
        <button onclick="window.parent.postMessage({type: 'pine-reload'}, '*')" style="background: #28a745; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Reload</button>
        <button onclick="window.parent.postMessage({type: 'pine-close'}, '*')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Close</button>
      </div>
    `
    
    // Inject pine controls before closing body tag
    if (modifiedContent.includes('</body>')) {
      modifiedContent = modifiedContent.replace('</body>', `${pineControls}</body>`)
    } else {
      modifiedContent += pineControls
    }
    
    return new NextResponse(modifiedContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'X-Frame-Options': 'SAMEORIGIN',
      }
    })
  } catch (error) {
    console.error('HDUN proxy error:', error)
    return NextResponse.json({ error: 'Failed to load game' }, { status: 500 })
  }
}
