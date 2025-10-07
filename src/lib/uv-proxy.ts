// UV Proxy utilities for Pine

export function getUVProxyUrl(url: string): string {
  if (typeof window === 'undefined') return url
  
  // Encode the URL for UV proxy
  const encodedUrl = encodeURIComponent(url)
  return `/uv/service/${encodedUrl}`
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
