// UV Proxy utilities for Pine (using UV-Static-2.0 /active mount)

export function getUVProxyUrl(url: string): string {
  if (typeof window === 'undefined') return url
  const w: any = window as any
  try {
    if (w.__uv$config && typeof w.__uv$config.encodeUrl === 'function') {
      const prefix: string = w.__uv$config.prefix || '/active/uv/service/'
      return `${prefix}${w.__uv$config.encodeUrl(url)}`
    }
  } catch {}
  // Fallback (will likely not work without client): keep original URL
  return url
}

export async function registerUVServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }
  
  try {
    // Register the /active/uv/sw.js service worker
    const registration = await navigator.serviceWorker.register('/active/uv/sw.js', {
      scope: '/active/uv/service/',
    })
    
    console.log('[UV] Service Worker registered:', registration.scope)
    
    // Wait for service worker to be active
    if (registration.installing) {
      await new Promise<void>((resolve) => {
        registration.installing!.addEventListener('statechange', function() {
          if (this.state === 'activated') resolve()
        })
      })
    }
    
    return true
  } catch (error) {
    console.error('[UV] Service Worker registration failed:', error)
    return false
  }
}

export function isUVReady(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.serviceWorker.controller !== null
}

export async function ensureUVClientReady(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  const w: any = window as any
  const have = () => !!(w.__uv$config && w.Ultraviolet)
  if (have()) return true
  const load = (src: string) => new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
  try {
    // Load UV scripts from /active mount (UV-Static-2.0)
    await load('/active/uv/uv.bundle.js')
    await load('/active/uv/uv.config.js')
    await load('/active/uv/uv.client.js')
  } catch (e) {
    console.error('[UV] Failed to load client scripts:', e)
    return false
  }
  return have()
}
