"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, Github, Settings, Plus } from "lucide-react"
import { useState } from "react"
import { CloakSelector } from "@/components/cloak/cloak-selector"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { CategoryDropdown } from "@/components/ui/category-dropdown"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block text-2xl">
                  pine
                </span>
              </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
            <Link
              href="/games"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              All Games
            </Link>
            <Link
              href="/category/new"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              New Games
            </Link>
                <Link
                  href="/category/popular"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Popular
                </Link>
            <Link
              href="/category/arcade"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Arcade
            </Link>
            <Link
              href="/add-game"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Add Game
            </Link>
                <Link
                  href="/api"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  API
                </Link>
                <Link
                  href="/settings"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Settings
                </Link>
          </nav>
        </div>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <CategoryDropdown />
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-8 md:w-[100px] lg:w-[200px]"
                    />
                  </form>
                </div>
              </div>
          <nav className="flex items-center space-x-2">
            <CloakSelector />
            <Link
              href="https://github.com/rohan/pine"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
