import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ThumbsUp, Eye } from "lucide-react"
import { Game } from "@/types/game"
import { useSettings } from "@/contexts/settings-context"

interface GameCardProps {
  game: Game
}

// Map source to display name and color
const sourceInfo: Record<string, { name: string; color: string }> = {
  lessons: { name: 'Lessons', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  hdun: { name: 'HDUN', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  fortnite: { name: 'Fortnite', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  radon: { name: 'Radon', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  gamesnacks: { name: 'GameSnacks', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  gnmath: { name: 'gn-math', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  s16: { name: 's16.lol', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  classwork: { name: 'Classwork', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
}

export function GameCard({ game }: GameCardProps) {
  const { settings } = useSettings()
  const rating = game.upvotes + game.downvotes > 0 
    ? (game.upvotes / (game.upvotes + game.downvotes)) * 5 
    : 0
  
  const source = sourceInfo[game.source || 'lessons'] || sourceInfo.lessons

  return (
    <Link href={`/play/${game.id}`} prefetch={false} className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-lg">
      <Card className={`game-card group ${settings.compactMode ? 'compact' : ''}`}>
        {settings.showThumbnails && (
          <div className="relative overflow-hidden">
            <Image
              src={game.thumbnail}
              alt={game.title}
              width={200}
              height={120}
              className="game-thumbnail object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                try { (e.currentTarget as HTMLImageElement).src = '/images/logo.png' } catch {}
              }}
            />
            {/* Subtle source badge in top-right corner */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Badge variant="secondary" className={`text-xs ${source.color} border-0`}>
                {source.name}
              </Badge>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </div>
        )}
      
      <CardContent className="p-4">
        <h3 className="game-title font-semibold text-lg mb-2 line-clamp-2">
          {game.title}
        </h3>
        
        {settings.showDescriptions && game.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {game.description}
          </p>
        )}
        
        {settings.showTags && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary" className="text-xs">
              {game.category}
            </Badge>
            {game.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
        {settings.showStats && (
          <CardFooter className="p-4 pt-0">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{game.upvotes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{game.playCount}</span>
                </div>
              </div>
              {rating > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
