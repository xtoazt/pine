"use client"

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useUserProfile } from '@/hooks/useUserProfile'
import { AuthModal } from '@/components/auth/auth-modal'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  gameId: string
  className?: string
}

export function LikeButton({ gameId, className }: LikeButtonProps) {
  const { user } = useAuth()
  const { profile, likeGame } = useUserProfile()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (profile) {
      setIsLiked(profile.likedGames?.includes(gameId) || false)
    }
  }, [profile, gameId])

  const handleLike = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    await likeGame(gameId)
  }

  return (
    <>
      <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        className={cn("gap-2", className)}
      >
        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        {isLiked ? 'Liked' : 'Like'}
      </Button>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
