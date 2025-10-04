"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProxyPage() {
  const [url, setUrl] = useState('https://example.com')
  const [go, setGo] = useState('')

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    const u = url.startsWith('http') ? url : `https://${url}`
    setGo(`/api/ds/proxy?url=${encodeURIComponent(u)}`)
  }

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open via Proxy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOpen} className="flex gap-2">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL (e.g., example.com)" />
            <Button type="submit">Open</Button>
          </form>
        </CardContent>
      </Card>

      {go && (
        <div className="aspect-video bg-muted rounded overflow-hidden">
          <iframe src={go} className="w-full h-full border-0" allowFullScreen />
        </div>
      )}
    </div>
  )
}


