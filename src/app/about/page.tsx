"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-10 relative">
      <div className="absolute inset-0 -z-10 hero-gradient opacity-50" />
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-5xl font-bold">About pine</h1>
        <p className="text-muted-foreground text-lg">
          pine is a premium, distraction-free hub for unblocked games. We aggregate multiple sources (Lessons, s16, GameSnacks, Radon, Arcade, Classwork, Fortnite) into one fast catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Privacy-first</CardTitle>
            <CardDescription>No tracking. No ads. Ever.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your data stays on your device. Sign-in (optional) saves progress.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Fast by design</CardTitle>
            <CardDescription>Optimized for school and work</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Infinite-scroll loading, on-the-fly proxy rewrites, and smart caching keep the experience instant.
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Open source</CardTitle>
            <CardDescription>Community-driven</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We welcome contributions—new sources, bug fixes, and UI polish.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
            <CardDescription>How games are fetched</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Lessons are proxied with HTML rewriting. Arcade and Classwork use clean embedded iframes with zoom. s16 uses the Bread-org indices mapped into our catalog.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reliability</CardTitle>
            <CardDescription>Mirror-first proxying</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Our DS proxy prefers our in-app Mirror, falls back to Codetabs, and finally direct fetch—ensuring games load even when providers change their headers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


