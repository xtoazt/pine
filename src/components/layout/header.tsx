"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, Github, Trophy, User, LogOut, Flame, MessageCircle, Target, Crown, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useGameStats } from "@/hooks/useGameStats"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { AchievementToast } from "@/components/gamification/achievement-toast"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { stats, achievements, newAchievement } = useGameStats()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Both @ source searches and regular searches go to /search
      // The search page will handle @ source filtering
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  Explore
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/games">All Games</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category">Categories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games?sort=popular">Popular</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games?sort=newest">New</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  Progress
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/streak">Streak</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/stats">Stats</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/goals">Goals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leagues">Leagues</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/friends">Friends</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/shop">Shop</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search... (Try @s16)"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pl-8 w-[150px] lg:w-[250px]"
                        />
              </form>
          <nav className="flex items-center space-x-2">
            {/* Streak Indicator */}
            {stats.streak > 0 && (
              <Link href="/streak">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-semibold">{stats.streak}</span>
                </Button>
              </Link>
            )}
            
            {/* Level Indicator */}
            <Link href="/stats">
              <Button variant="ghost" size="sm" className="gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold">Lv.{stats.level}</span>
              </Button>
            </Link>
            
            {/* XP Indicator */}
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold">{stats.xp}</span>
              </Button>
            </Link>
            
            <Link href="https://github.com/xtoazt/pine" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
            
            {/* Auth Controls */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/stats">
                      <Trophy className="mr-2 h-4 w-4" />
                      Stats & Achievements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <User className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </nav>
          
          {/* Achievement Toast */}
          <AchievementToast achievement={newAchievement} />
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}
