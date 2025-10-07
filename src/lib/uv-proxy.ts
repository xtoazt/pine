// UV Proxy utilities for Pine

export function getUVProxyUrl(url: string): string {
  if (typeof window === 'undefined') return url
  const w: any = window as any
  try {
    if (w.__uv$config && typeof w.__uv$config.encodeUrl === 'function') {
      const prefix: string = w.__uv$config.prefix || '/uv/service/'
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
    const registration = await navigator.serviceWorker.register('/uv-sw.js', {
      scope: '/uv/service/',
    })
    
    console.log('[UV] Service Worker registered:', registration.scope)
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
    // Load bundle, config, then client in sequence
    await load('/uv/uv/uv.bundle.js')
    await load('/uv/uv/uv.config.js')
    await load('/uv/uv/uv.client.js')
  } catch (e) {
    console.error('[UV] Failed to load client scripts:', e)
    return false
  }
  return have()
}
