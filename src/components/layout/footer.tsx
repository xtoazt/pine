import Link from "next/link"
import { Gamepad2, Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">pine</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A clean, minimalist game platform with 100+ carefully curated games. No ads, no tracking.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by</span>
              <Link href="https://github.com/rohan" className="text-primary hover:underline">
                Rohan
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Games</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/new" className="text-muted-foreground hover:text-primary transition-colors">
                  New Games
                </Link>
              </li>
              <li>
                <Link href="/category/popular" className="text-muted-foreground hover:text-primary transition-colors">
                  Popular Games
                </Link>
              </li>
              <li>
                <Link href="/category/2-player" className="text-muted-foreground hover:text-primary transition-colors">
                  2 Player Games
                </Link>
              </li>
              <li>
                <Link href="/category/action" className="text-muted-foreground hover:text-primary transition-colors">
                  Action Games
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Developers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/api/games" className="text-muted-foreground hover:text-primary transition-colors">
                  Games API
                </Link>
              </li>
              <li>
                <Link href="/api/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories API
                </Link>
              </li>
              <li>
                <Link href="https://github.com/rohan/pine" className="text-muted-foreground hover:text-primary transition-colors">
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/rohan/pine" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Open source and free to use. No ads, no tracking.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 pine. All rights reserved. Built with modern web technologies.</p>
        </div>
      </div>
    </footer>
  )
}
