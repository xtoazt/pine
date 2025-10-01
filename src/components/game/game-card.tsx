import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ThumbsUp, Eye } from "lucide-react"
import { Game } from "@/types/game"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const rating = game.upvotes + game.downvotes > 0 
    ? (game.upvotes / (game.upvotes + game.downvotes)) * 5 
    : 0

  return (
    <Card className="game-card group">
      <div className="relative overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.title}
          width={200}
          height={120}
          className="game-thumbnail object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" asChild>
            <Link href={game.playUrl}>
              <Play className="h-4 w-4 mr-2" />
              Play Now
            </Link>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="game-title font-semibold text-lg mb-2 line-clamp-2">
          {game.title}
        </h3>
        
        {game.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {game.description}
          </p>
        )}
        
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
      </CardContent>
      
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
    </Card>
  )
}
