"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UVProxyPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the UV static page
    window.location.href = '/uv/index.html'
  }, [])

  return (
    <div className="container py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Loading UV Proxy...</h1>
      <p className="text-muted-foreground">Redirecting to proxy interface...</p>
    </div>
  )
}
