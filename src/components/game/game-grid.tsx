import { GameCard } from "./game-card"
import { Game } from "@/types/game"
import { useSettings } from "@/contexts/settings-context"
import { useCustomGames } from "@/hooks/useCustomGames"

interface GameGridProps {
  games: Game[]
  loading?: boolean
}

export function GameGrid({ games, loading = false }: GameGridProps) {
  const { settings } = useSettings()
  const { customGames } = useCustomGames()
  
  // Combine regular games with custom games
  const allGames = [...games, ...customGames]
  if (loading) {
    return (
      <div className="game-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="game-card animate-pulse">
            <div className="w-full h-32 bg-muted rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No games found</p>
        <p className="text-muted-foreground text-sm mt-2">
          Try adjusting your search or browse different categories
        </p>
      </div>
    )
  }

  const gridCols = settings.layout === 'list' ? 'grid-cols-1' : 
                   settings.layout === 'compact' ? `grid-cols-${Math.min(settings.gamesPerRow * 2, 8)}` :
                   `grid-cols-${settings.gamesPerRow}`

  return (
    <div className={`game-grid grid gap-4 ${gridCols}`}>
      {allGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
