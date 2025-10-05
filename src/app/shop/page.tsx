"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGameStats } from '@/hooks/useGameStats'
import { useAuth } from '@/contexts/auth-context'
import { ShoppingCart, Zap, Shield, Flame, Crown, Star, Gift } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  icon: any
  category: 'streak' | 'cosmetic' | 'boost'
  owned?: boolean
}

const shopItems: ShopItem[] = [
  {
    id: 'streak-freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak from breaks',
    price: 100,
    icon: Shield,
    category: 'streak',
  },
  {
    id: 'double-xp',
    name: 'Double XP Boost',
    description: 'Earn 2x XP for 1 hour',
    price: 50,
    icon: Zap,
    category: 'boost',
  },
  {
    id: 'golden-crown',
    name: 'Golden Crown',
    description: 'Exclusive profile badge',
    price: 200,
    icon: Crown,
    category: 'cosmetic',
  },
  {
    id: 'fire-avatar',
    name: 'Fire Avatar',
    description: 'Animated fire profile picture',
    price: 150,
    icon: Flame,
    category: 'cosmetic',
  },
  {
    id: 'star-border',
    name: 'Star Border',
    description: 'Sparkling border around your name',
    price: 75,
    icon: Star,
    category: 'cosmetic',
  },
]

export default function ShopPage() {
  const { user } = useAuth()
  const { stats } = useGameStats()
  const [items, setItems] = useState<ShopItem[]>(shopItems)
  const [loading, setLoading] = useState<string | null>(null)

  const purchaseItem = async (item: ShopItem) => {
    if (!user || !db || stats.xp < item.price) return

    setLoading(item.id)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        xp: stats.xp - item.price,
        [`ownedItems.${item.id}`]: true,
        updatedAt: serverTimestamp(),
      })
      
      // Update local state
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, owned: true } : i
      ))
    } catch (error) {
      console.error('Error purchasing item:', error)
    } finally {
      setLoading(null)
    }
  }

  const canAfford = (price: number) => stats.xp >= price

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Rewards Shop</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Spend your XP on exclusive items and boosts
        </p>
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-2xl font-bold text-yellow-500">{stats.xp} XP</span>
        </div>
      </div>

      {/* Shop Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="relative">
            {item.owned && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                Owned ✓
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" />
                {item.name}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{item.price} XP</span>
                </div>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              
              <Button
                className="w-full"
                onClick={() => purchaseItem(item)}
                disabled={item.owned || !canAfford(item.price) || loading === item.id}
              >
                {item.owned ? 'Owned' : 
                 !canAfford(item.price) ? 'Not enough XP' :
                 loading === item.id ? 'Purchasing...' : 'Purchase'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">More Items</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Custom themes</li>
                <li>• Animated avatars</li>
                <li>• Profile backgrounds</li>
                <li>• Achievement badges</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Special Offers</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Daily free items</li>
                <li>• Limited-time offers</li>
                <li>• Bundle deals</li>
                <li>• Seasonal rewards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!user && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardContent className="p-6 text-center space-y-4">
            <ShoppingCart className="h-12 w-12 mx-auto text-primary" />
            <p className="text-lg font-medium">
              Sign in to access the rewards shop and spend your XP!
            </p>
            <Button size="lg">Create Account</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
