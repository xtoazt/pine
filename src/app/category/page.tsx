"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GameCategory } from '@/types/game'
import { Gamepad2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<GameCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Game Categories</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore games by category. Each category contains carefully curated games 
          for different types of gameplay experiences.
        </p>
        <Badge variant="secondary" className="text-sm">
          {categories.length} categories available
        </Badge>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{category.name}</span>
                <span className="text-2xl">{category.icon}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {category.gameCount} games
                </Badge>
                <Button size="sm" asChild>
                  <Link href={`/category/${category.slug}`}>
                    Explore
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Games Link */}
      <div className="text-center pt-8">
        <Button size="lg" asChild>
          <Link href="/games">
            <Gamepad2 className="mr-2 h-4 w-4" />
            View All Games
          </Link>
        </Button>
      </div>
    </div>
  )
}
