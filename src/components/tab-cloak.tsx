"use client"

import { useEffect } from 'react'

export function TabCloak() {
  useEffect(() => {
    // Store original values
    const originalTitle = document.title
    const originalFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    const originalFaviconHref = originalFavicon?.href || ''

    // Google values for cloaking
    const googleTitle = 'Google'
    const googleFavicon = 'https://www.google.com/favicon.ico'

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive - cloak as Google
        document.title = googleTitle
        if (originalFavicon) {
          originalFavicon.href = googleFavicon
        }
      } else {
        // Tab is active - show Pine
        document.title = originalTitle
        if (originalFavicon && originalFaviconHref) {
          originalFavicon.href = originalFaviconHref
        }
      }
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.title = originalTitle
      if (originalFavicon && originalFaviconHref) {
        originalFavicon.href = originalFaviconHref
      }
    }
  }, [])

  return null
}
