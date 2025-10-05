import { Game } from '@/types/game'

// Sample games from lessons data (for individual game API)
export const mockGames: Game[] = [
  {
    id: "lesson-1",
    title: "Yohoho",
    description: "Play Yohoho - an exciting game with engaging gameplay and fun challenges.",
    thumbnail: "/proxy/lessons-img/lesson-1.webp",
    category: "casual",
    tags: ["casual"],
    playUrl: "/play/lesson-1",
    upvotes: 3905,
    downvotes: 175,
    playCount: 3682,
    source: "lessons",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    id: "lesson-2",
    title: "Paperio 2",
    description: "Play Paperio 2 - an exciting game with engaging gameplay and fun challenges.",
    thumbnail: "/proxy/lessons-img/lesson-2.webp",
    category: "multiplayer",
    tags: ["multiplayer", "casual"],
    playUrl: "/play/lesson-2",
    upvotes: 1844,
    downvotes: 50,
    playCount: 94922,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    id: "lesson-3",
    title: "Paperio 3",
    description: "Play Paperio 3 - an exciting game with engaging gameplay and fun challenges.",
    thumbnail: "/proxy/lessons-img/lesson-3.webp",
    category: "multiplayer",
    tags: ["multiplayer", "casual"],
    playUrl: "/play/lesson-3",
    upvotes: 434,
    downvotes: 124,
    playCount: 70186,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    id: "lesson-4",
    title: "2048 Hacked",
    description: "Play 2048 Hacked - an exciting game with engaging gameplay and fun challenges.",
    thumbnail: "/proxy/lessons-img/lesson-4.webp",
    category: "puzzle",
    tags: ["puzzle"],
    playUrl: "/play/lesson-4",
    upvotes: 3048,
    downvotes: 96,
    playCount: 85801,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    id: "lesson-5",
    title: "3d Free Kick",
    description: "Play 3d Free Kick - an exciting game with engaging gameplay and fun challenges.",
    thumbnail: "/proxy/lessons-img/lesson-5.webp",
    category: "sports",
    tags: ["sports"],
    playUrl: "/play/lesson-5",
    upvotes: 4055,
    downvotes: 140,
    playCount: 82081,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  }
  // Add more games here - this is a simplified version for the individual game API
]

// Get all games (just returns mock games - full games list is in API route)
export const getAllGames = (): Game[] => {
  return mockGames
}
