"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Global error captured:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred. You can try again or go back home.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go home</Link>
              </Button>
            </div>
            {error?.digest && (
              <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}


