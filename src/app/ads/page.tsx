"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AdsPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold">Support pine</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Help keep pine running and ad-free for everyone. Your support helps us maintain 
          the servers and continue providing 6,000+ games for free.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">No Ads on Main Site</Badge>
          <Badge variant="secondary">Optional Support</Badge>
          <Badge variant="secondary">Keep pine Free</Badge>
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Support with Ads
            </CardTitle>
            <CardDescription>
              View a few ads to support pine development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By viewing ads on this page, you help support pine without affecting 
              the main gaming experience. Ads are only shown here, never on the main site.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Ad content will appear below:
              </p>
              {/* Ad placeholder - in production, this would be replaced with actual ad code */}
              <div className="w-full h-32 bg-muted border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Ad Space</p>
              </div>
            </div>
            <Button className="w-full" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Support Ads
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Ad integration coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Other Ways to Support
            </CardTitle>
            <CardDescription>
              Alternative ways to help keep pine running
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Share pine</h4>
                <p className="text-xs text-muted-foreground">
                  Tell your friends about pine and help grow our community
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Report Issues</h4>
                <p className="text-xs text-muted-foreground">
                  Help us improve by reporting bugs or suggesting features
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Star on GitHub</h4>
                <p className="text-xs text-muted-foreground">
                  Show your support by starring our open source project
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="https://github.com/rohan/pine" target="_blank">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/api">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  API Docs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Support pine?</CardTitle>
          <CardDescription>
            Understanding how your support helps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">6,000+</div>
              <div className="text-sm text-muted-foreground">Free Games</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Ads on Main Site</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Our Promise</h4>
            <p className="text-sm text-muted-foreground">
              pine will always remain free to use with no ads on the main gaming experience. 
              Any ads are completely optional and only shown on this support page. 
              Your support helps us maintain servers, add new games, and keep the platform running smoothly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </div>
    </div>
  )
}
