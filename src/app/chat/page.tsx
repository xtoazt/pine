"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the standalone chat HTML page
    window.location.href = '/chat.html'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading chat...</p>
    </div>
  )
}
