"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Gamepad2, Flame, Sparkles, Sword, Target, Car, Joystick, Puzzle, Users, Brain, Zap } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  gameCount: number
  icon: string
}

function CategoryDropdownContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = (searchParams?.get?.('category') as string) || 'all'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategorySelect = (categorySlug: string) => {
    if (categorySlug === 'all') {
      router.push('/games')
    } else {
      router.push(`/category/${categorySlug}`)
    }
  }

  const currentCategoryData = (categories || []).find(cat => cat && cat.slug === currentCategory)

  const IconForSlug = ({ slug }: { slug: string }) => {
    switch (slug) {
      case 'all':
        return <Gamepad2 className="h-4 w-4" />
      case 'popular':
        return <Flame className="h-4 w-4" />
      case 'new':
        return <Sparkles className="h-4 w-4" />
      case 'action':
        return <Sword className="h-4 w-4" />
      case 'shooter':
        return <Target className="h-4 w-4" />
      case 'car':
        return <Car className="h-4 w-4" />
      case 'arcade':
        return <Joystick className="h-4 w-4" />
      case 'puzzle':
        return <Puzzle className="h-4 w-4" />
      case 'multiplayer':
        return <Users className="h-4 w-4" />
      case 'strategy':
        return <Brain className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Gamepad2 className="mr-2 h-4 w-4" />
        Loading...
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-between">
          <div className="flex items-center">
            <span className="mr-2 flex items-center"><IconForSlug slug={currentCategoryData?.slug || 'all'} /></span>
            <span>{currentCategoryData?.name || 'All Games'}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {/* Special Categories */}
        <DropdownMenuItem onClick={() => handleCategorySelect('all')}>
          <span className="mr-2"><Gamepad2 className="h-4 w-4" /></span>
          <div className="flex flex-col">
            <span>All Games</span>
            <span className="text-xs text-muted-foreground">
              Browse all {categories.find(c => c.slug === 'all')?.gameCount || 0} games
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCategorySelect('popular')}>
          <span className="mr-2"><Flame className="h-4 w-4" /></span>
          <div className="flex flex-col">
            <span>Popular</span>
            <span className="text-xs text-muted-foreground">Most popular games</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCategorySelect('new')}>
          <span className="mr-2"><Sparkles className="h-4 w-4" /></span>
          <div className="flex flex-col">
            <span>New Games</span>
            <span className="text-xs text-muted-foreground">Recently added</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Game Categories - Top 8 only */}
        {(categories || [])
          .filter(cat => cat && !['all', 'popular', 'new'].includes(cat.slug))
          .filter(cat => cat && cat.gameCount > 0)
          .slice(0, 8) // Limit to top 8 categories for cleaner UI
          .map((category) => (
            <DropdownMenuItem 
              key={category.id} 
              onClick={() => handleCategorySelect(category.slug)}
            >
              <span className="mr-2"><IconForSlug slug={category.slug} /></span>
              <div className="flex flex-col">
                <span>{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.gameCount} games
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleCategorySelect('all')}>
          <span className="mr-2">📋</span>
          <div className="flex flex-col">
            <span>View All Categories</span>
            <span className="text-xs text-muted-foreground">See all {categories.length} categories</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CategoryDropdown() {
  return (
    <Suspense fallback={
      <Button variant="outline" disabled>
        <Gamepad2 className="mr-2 h-4 w-4" />
        Loading...
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    }>
      <CategoryDropdownContent />
    </Suspense>
  )
}
