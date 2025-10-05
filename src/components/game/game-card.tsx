import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ThumbsUp, Eye } from "lucide-react"
import { Game } from "@/types/game"
import { useSettings } from "@/contexts/settings-context"
import { recordGameInteraction } from "@/lib/user-signals"
import { useState } from "react"

interface GameCardProps {
  game: Game
}

// Map source to display name and color
const sourceInfo: Record<string, { name: string; color: string }> = {
  lessons: { name: 'Lessons', color: '#3b82f6' },
  arcade: { name: 'Arcade', color: '#10b981' },
  fortnite: { name: 'Fortnite', color: '#a855f7' },
  radon: { name: 'Radon', color: '#f97316' },
  gamesnacks: { name: 'GameSnacks', color: '#ec4899' },
  gnmath: { name: 'gn-math', color: '#eab308' },
  s16: { name: 's16.lol', color: '#ef4444' },
  classwork: { name: 'Classwork', color: '#6366f1' },
}

export function GameCard({ game }: GameCardProps) {
  const { settings } = useSettings()
  const [showSource, setShowSource] = useState(false)
  
  const rating = game.upvotes + game.downvotes > 0 
    ? (game.upvotes / (game.upvotes + game.downvotes)) * 5 
    : 0
  
  const source = sourceInfo[game.source || 'lessons'] || sourceInfo.lessons

  const handleClick = () => {
    recordGameInteraction(game)
  }

  return (
    <Link 
      href={`/play/${game.id}`} 
      prefetch={false} 
      onClick={handleClick}
      onMouseEnter={() => setShowSource(true)}
      onMouseLeave={() => setShowSource(false)}
      className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
    >
        <Card className={`game-card group ${settings.compactMode ? 'compact' : ''} hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}>
          {settings.showThumbnails && (
            <div className="relative overflow-hidden">
              {game.thumbnail ? (
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  width={200}
                  height={120}
                  className="game-thumbnail object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    try { (e.currentTarget as HTMLImageElement).style.display = 'none' } catch {}
                    const fallback = (e.currentTarget.parentElement?.querySelector('[data-fallback]') as HTMLElement | null)
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : null}
              <div
                data-fallback
                style={{ display: game.thumbnail ? 'none' : 'flex' }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10"
              >
                <span className="px-2 text-center font-semibold text-sm line-clamp-3">
                  {game.title}
                </span>
              </div>
              
              {/* Source pill that follows cursor on hover (works even without thumbnail) */}
              {showSource && (
                <div
                  className="absolute pointer-events-none top-0 left-0 translate-x-[var(--mx,0px)] translate-y-[var(--my,0px)] transition-transform duration-75"
                  style={{['--mx' as any]: '0px', ['--my' as any]: '0px'}}
                  onMouseMove={(e) => {
                    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
                    const x = e.clientX - rect.left + 12
                    const y = e.clientY - rect.top + 12
                    ;(e.currentTarget as HTMLElement).style.setProperty('--mx', x + 'px')
                    ;(e.currentTarget as HTMLElement).style.setProperty('--my', y + 'px')
                  }}
                >
                  <span
                    className="px-2 py-1 rounded-full text-[10px] font-semibold shadow-premium glass"
                    style={{ backgroundColor: `${source.color}20`, color: source.color }}
                  >
                    {source.name}
                  </span>
                </div>
              )}
              
              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              
              {/* Play icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
                  <Play className="h-8 w-8" />
                </div>
              </div>
            </div>
          )}
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="game-title font-semibold text-lg line-clamp-2 flex-1">
              {game.title}
            </h3>
          {!settings.showThumbnails && (
            <div 
              className="w-4 h-4 rounded-full shrink-0 mt-1"
              style={{ backgroundColor: source.color }}
              title={source.name}
            />
          )}
          </div>
          
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