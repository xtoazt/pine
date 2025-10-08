import { NextRequest, NextResponse } from 'next/server'

/**
 * UV Redirect API
 * 
 * This endpoint generates an HTML page that:
 * 1. Loads UV client scripts
 * 2. Registers the UV service worker
 * 3. Redirects to the proxied URL through UV
 * 
 * Usage: /api/uv-redirect?url=https://example.com
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }
  
  // Validate URL
  try {
    new URL(targetUrl)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }
  
  // Generate HTML page that will:
  // 1. Load UV scripts
  // 2. Register service worker
  // 3. Redirect to proxied URL
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading Game...</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #0a0a0a;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }
        .loader {
            text-align: center;
        }
        .spinner {
            border: 3px solid #333;
            border-top: 3px solid #5a32e3;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #5a32e3;
        }
        p {
            color: #888;
            font-size: 14px;
        }
        .error {
            color: #ff4444;
            background: #331111;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
        }
        iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
            display: none;
        }
        iframe.loaded {
            display: block;
        }
    </style>
</head>
<body>
    <div class="loader" id="loader">
        <div class="spinner"></div>
        <h1>Loading Game</h1>
        <p>Initializing secure connection...</p>
    </div>
    
    <iframe id="game-frame" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"></iframe>
    
    <script src="/active/uv/uv.bundle.js"></script>
    <script src="/active/uv/uv.config.js"></script>
    <script src="/active/uv/uv.client.js"></script>
    
    <script>
        const targetUrl = ${JSON.stringify(targetUrl)};
        
        async function loadGame() {
            try {
                // Register service worker
                if (!navigator.serviceWorker) {
                    throw new Error('Service Workers not supported');
                }
                
                const registration = await navigator.serviceWorker.register('/active/uv/sw.js', {
                    scope: '/active/uv/service/'
                });
                
                console.log('[UV] Service Worker registered');
                
                // Wait for SW to be ready
                await navigator.serviceWorker.ready;
                
                // Generate proxied URL
                if (!window.__uv$config || !window.Ultraviolet) {
                    throw new Error('UV scripts not loaded');
                }
                
                const prefix = window.__uv$config.prefix || '/active/uv/service/';
                const encodedUrl = window.__uv$config.encodeUrl(targetUrl);
                const proxiedUrl = prefix + encodedUrl;
                
                console.log('[UV] Loading:', targetUrl);
                console.log('[UV] Proxied URL:', proxiedUrl);
                
                // Load in iframe
                const iframe = document.getElementById('game-frame');
                iframe.src = proxiedUrl;
                
                // Show iframe when loaded
                iframe.onload = () => {
                    document.getElementById('loader').style.display = 'none';
                    iframe.classList.add('loaded');
                };
                
                iframe.onerror = () => {
                    throw new Error('Failed to load game');
                };
                
            } catch (error) {
                console.error('[UV] Error:', error);
                document.getElementById('loader').innerHTML = \`
                    <div class="error">
                        <h1>❌ Error</h1>
                        <p>\${error.message}</p>
                        <p style="margin-top: 10px;">
                            <button onclick="window.location.reload()" style="background: #5a32e3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                                Try Again
                            </button>
                        </p>
                    </div>
                \`;
            }
        }
        
        // Start loading
        loadGame();
    </script>
</body>
</html>`
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  })
}

