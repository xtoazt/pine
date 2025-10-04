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
import { ChevronDown, Gamepad2 } from 'lucide-react'

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
  const currentCategory = searchParams.get('category') || 'all'

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
            <span className="mr-2">{currentCategoryData?.icon || '🎮'}</span>
            <span>{currentCategoryData?.name || 'All Games'}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {/* Special Categories */}
        <DropdownMenuItem onClick={() => handleCategorySelect('all')}>
          <span className="mr-2">🎮</span>
          <div className="flex flex-col">
            <span>All Games</span>
            <span className="text-xs text-muted-foreground">
              Browse all {categories.find(c => c.slug === 'all')?.gameCount || 0} games
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCategorySelect('popular')}>
          <span className="mr-2">🔥</span>
          <div className="flex flex-col">
            <span>Popular</span>
            <span className="text-xs text-muted-foreground">Most popular games</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleCategorySelect('new')}>
          <span className="mr-2">✨</span>
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
              <span className="mr-2">{category.icon}</span>
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
