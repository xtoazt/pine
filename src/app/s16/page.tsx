"use client"

import Script from 'next/script'

export default function S16Page() {
  return (
    <div className="container py-8 min-h-[80vh]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">s16.lol Games</h1>
        <p className="text-sm text-muted-foreground">Embedded catalog powered by Bread-org.</p>
      </div>
      <div id="gameContainer" className="w-full min-h-[70vh] rounded-lg overflow-hidden border" />

      <Script
        id="s16-embed"
        src="https://cdn.jsdelivr.net/gh/Bread-org/s16.games/embed.js"
        strategy="afterInteractive"
        defer
        data-api="https://bread-org.github.io/s16.games"
        data-api2="https://bread-org.github.io/s16.chunk2"
        data-target="#gameContainer"
      />
    </div>
  )
}


