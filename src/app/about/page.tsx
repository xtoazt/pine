"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-4xl font-bold">About pine</h1>
        <p className="text-muted-foreground">
          pine is a premium, distraction-free hub for unblocked games, built for speed and simplicity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Privacy-first</CardTitle>
            <CardDescription>No tracking. No ads. Ever.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We keep your experience clean and focused on play.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Fast by design</CardTitle>
            <CardDescription>Optimized for school and work</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Lightweight UI, smart caching, and careful integrations.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Open source</CardTitle>
            <CardDescription>Community-driven</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built openly so anyone can improve or self-host.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


