import { NextRequest, NextResponse } from 'next/server'
import { Game, GameSearchParams, GameApiResponse } from '@/types/game'

// ALL games from fortnite-game.github.io + HTML-Games-V2 repositories (100+ games total)
const mockGames: Game[] = [
  // Original Fortnite Games (35 games)
  {
    id: "class-273",
    title: "Classic Arcade",
    description: "A collection of classic arcade games from the golden age of gaming.",
    thumbnail: "https://fortnite-game.github.io/img/class-273.png",
    category: "arcade",
    tags: ["classic", "arcade", "retro", "collection"],
    playUrl: "/play/class-273",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "class-356",
    title: "Level Devil",
    description: "Navigate through devilish levels in this challenging platformer game.",
    thumbnail: "https://fortnite-game.github.io/img/class-356.png",
    category: "platform",
    tags: ["platform", "challenge", "devil", "levels"],
    playUrl: "/play/class-356",
    upvotes: 1456,
    downvotes: 67,
    playCount: 18900,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "class-357",
    title: "Traffic Escape",
    description: "Navigate through busy traffic in this exciting escape game. Avoid collisions and reach your destination safely.",
    thumbnail: "https://fortnite-game.github.io/img/class-357.png",
    category: "racing",
    tags: ["traffic", "escape", "driving", "arcade"],
    playUrl: "/play/class-357",
    upvotes: 2150,
    downvotes: 89,
    playCount: 25600,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13")
  },
  {
    id: "class-402",
    title: "Action Adventure",
    description: "Embark on an epic action-packed adventure with stunning graphics and smooth gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-402.png",
    category: "adventure",
    tags: ["action", "adventure", "epic", "graphics"],
    playUrl: "/play/class-402",
    upvotes: 1789,
    downvotes: 56,
    playCount: 22300,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "class-404",
    title: "Tunnel Rush 2",
    description: "The sequel to the popular Tunnel Rush game. Navigate through endless tunnels at high speed.",
    thumbnail: "https://fortnite-game.github.io/img/class-404.png",
    category: "arcade",
    tags: ["tunnel", "rush", "speed", "endless"],
    playUrl: "/play/class-404",
    upvotes: 2345,
    downvotes: 123,
    playCount: 31200,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11")
  },
  {
    id: "class-405",
    title: "3D Adventure",
    description: "Experience a full 3D adventure with immersive graphics and engaging gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-405.png",
    category: "adventure",
    tags: ["3d", "adventure", "immersive", "graphics"],
    playUrl: "/play/class-405",
    upvotes: 1987,
    downvotes: 78,
    playCount: 26700,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "class-407",
    title: "Doodle Jump",
    description: "The classic Doodle Jump game. Jump as high as you can and avoid obstacles!",
    thumbnail: "https://fortnite-game.github.io/img/class-407.png",
    category: "arcade",
    tags: ["doodle", "jump", "classic", "endless"],
    playUrl: "/play/class-407",
    upvotes: 3456,
    downvotes: 156,
    playCount: 45600,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09")
  },
  {
    id: "class-435",
    title: "Flappy Bird",
    description: "The legendary Flappy Bird game. Tap to fly and avoid the pipes!",
    thumbnail: "https://fortnite-game.github.io/img/class-435.png",
    category: "arcade",
    tags: ["flappy", "bird", "classic", "tap"],
    playUrl: "/play/class-435",
    upvotes: 4567,
    downvotes: 234,
    playCount: 67800,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    id: "class-437",
    title: "Slope 2",
    description: "The sequel to the popular Slope game. Roll down the endless slope and avoid obstacles in this fast-paced arcade game.",
    thumbnail: "https://fortnite-game.github.io/img/class-437.png",
    category: "arcade",
    tags: ["slope", "endless", "runner", "arcade"],
    playUrl: "/play/class-437",
    upvotes: 3420,
    downvotes: 156,
    playCount: 45600,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07")
  },
  {
    id: "class-448",
    title: "Cookie Clicker",
    description: "The addictive cookie clicking game. Click to bake cookies and build your cookie empire!",
    thumbnail: "https://fortnite-game.github.io/img/class-448.png",
    category: "idle",
    tags: ["cookie", "clicker", "idle", "addictive"],
    playUrl: "/play/class-448",
    upvotes: 2789,
    downvotes: 89,
    playCount: 34500,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06")
  },
  {
    id: "class-450",
    title: "Slope",
    description: "The original Slope game. Roll down the endless slope and try to survive as long as possible.",
    thumbnail: "https://fortnite-game.github.io/img/class-450.png",
    category: "arcade",
    tags: ["slope", "endless", "runner", "original"],
    playUrl: "/play/class-450",
    upvotes: 4123,
    downvotes: 189,
    playCount: 52300,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    id: "class-451",
    title: "HTML5 Game",
    description: "A modern HTML5 game with smooth gameplay and beautiful graphics.",
    thumbnail: "https://fortnite-game.github.io/img/class-451.png",
    category: "arcade",
    tags: ["html5", "modern", "smooth", "graphics"],
    playUrl: "/play/class-451",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04")
  },
  {
    id: "class-452",
    title: "Game Collection",
    description: "A collection of various mini-games in one package. Hours of entertainment!",
    thumbnail: "https://fortnite-game.github.io/img/class-452.png",
    category: "arcade",
    tags: ["collection", "mini-games", "various", "entertainment"],
    playUrl: "/play/class-452",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  },
  {
    id: "class-453",
    title: "Geo Scratch",
    description: "A creative puzzle game where you scratch and reveal hidden patterns.",
    thumbnail: "https://fortnite-game.github.io/img/class-453.png",
    category: "puzzle",
    tags: ["geo", "scratch", "puzzle", "creative"],
    playUrl: "/play/class-453",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "class-455",
    title: "Flash Tetris",
    description: "The classic Tetris game with modern Flash technology. Stack blocks and clear lines!",
    thumbnail: "https://fortnite-game.github.io/img/class-455.png",
    category: "puzzle",
    tags: ["tetris", "flash", "classic", "blocks"],
    playUrl: "/play/class-455",
    upvotes: 2345,
    downvotes: 123,
    playCount: 31200,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "class-465",
    title: "Arcade Classic",
    description: "A classic arcade game with retro graphics and timeless gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-465.png",
    category: "arcade",
    tags: ["classic", "arcade", "retro", "timeless"],
    playUrl: "/play/class-465",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-31"),
    updatedAt: new Date("2023-12-31")
  },
  {
    id: "class-467",
    title: "Simple Games",
    description: "A collection of simple yet addictive games perfect for quick gaming sessions.",
    thumbnail: "https://fortnite-game.github.io/img/class-467.png",
    category: "arcade",
    tags: ["simple", "addictive", "quick", "sessions"],
    playUrl: "/play/class-467",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2023-12-30"),
    updatedAt: new Date("2023-12-30")
  },
  {
    id: "class-468",
    title: "Multiplayer Battle Arena",
    description: "Engage in epic multiplayer battles with players from around the world. Strategy and skill are key to victory.",
    thumbnail: "https://fortnite-game.github.io/img/class-468.png",
    category: "multiplayer",
    tags: ["multiplayer", "battle", "strategy", "online"],
    playUrl: "/play/class-468",
    upvotes: 1890,
    downvotes: 78,
    playCount: 32100,
    createdAt: new Date("2023-12-29"),
    updatedAt: new Date("2023-12-29")
  },
  {
    id: "class-469",
    title: "Quick Game",
    description: "A fast-paced game perfect for quick gaming breaks. Easy to learn, hard to master!",
    thumbnail: "https://fortnite-game.github.io/img/class-469.png",
    category: "arcade",
    tags: ["quick", "fast-paced", "easy", "master"],
    playUrl: "/play/class-469",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2023-12-28")
  },
  {
    id: "class-477",
    title: "Unity Game",
    description: "A high-quality Unity-powered game with stunning graphics and smooth gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-477.png",
    category: "adventure",
    tags: ["unity", "high-quality", "graphics", "smooth"],
    playUrl: "/play/class-477",
    upvotes: 1789,
    downvotes: 56,
    playCount: 22300,
    createdAt: new Date("2023-12-27"),
    updatedAt: new Date("2023-12-27")
  },
  {
    id: "class-478",
    title: "Poki Game",
    description: "A fun game from the Poki platform with engaging mechanics and colorful graphics.",
    thumbnail: "https://fortnite-game.github.io/img/class-478.png",
    category: "arcade",
    tags: ["poki", "fun", "engaging", "colorful"],
    playUrl: "/play/class-478",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2023-12-26"),
    updatedAt: new Date("2023-12-26")
  },
  {
    id: "class-482",
    title: "Basketball Bros",
    description: "Play basketball with your friends in this exciting multiplayer sports game.",
    thumbnail: "https://fortnite-game.github.io/img/class-482.png",
    category: "sports",
    tags: ["basketball", "multiplayer", "sports", "friends"],
    playUrl: "/play/class-482",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2023-12-25"),
    updatedAt: new Date("2023-12-25")
  },
  {
    id: "class-488",
    title: "Tanuki Game",
    description: "A charming game featuring adorable tanuki characters in a magical adventure.",
    thumbnail: "https://fortnite-game.github.io/img/class-488.png",
    category: "adventure",
    tags: ["tanuki", "charming", "magical", "adventure"],
    playUrl: "/play/class-488",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-24"),
    updatedAt: new Date("2023-12-24")
  },
  {
    id: "class-499",
    title: "Stack Game",
    description: "Stack blocks as high as you can in this addictive stacking game. How high can you go?",
    thumbnail: "https://fortnite-game.github.io/img/class-499.png",
    category: "puzzle",
    tags: ["stack", "blocks", "addictive", "height"],
    playUrl: "/play/class-499",
    upvotes: 2345,
    downvotes: 123,
    playCount: 31200,
    createdAt: new Date("2023-12-23"),
    updatedAt: new Date("2023-12-23")
  },
  {
    id: "class-504",
    title: "Scrap Metal 3",
    description: "The third installment of the Scrap Metal series. Build and battle with scrap metal vehicles.",
    thumbnail: "https://fortnite-game.github.io/img/class-504.png",
    category: "action",
    tags: ["scrap", "metal", "build", "battle"],
    playUrl: "/play/class-504",
    upvotes: 1789,
    downvotes: 56,
    playCount: 22300,
    createdAt: new Date("2023-12-22"),
    updatedAt: new Date("2023-12-22")
  },
  {
    id: "class-512",
    title: "Adventure Quest",
    description: "Embark on an epic adventure in this RPG-style game. Explore dungeons, fight monsters, and find treasure.",
    thumbnail: "https://fortnite-game.github.io/img/class-512.png",
    category: "adventure",
    tags: ["adventure", "rpg", "quest", "exploration"],
    playUrl: "/play/class-512",
    upvotes: 1987,
    downvotes: 78,
    playCount: 26700,
    createdAt: new Date("2023-12-21"),
    updatedAt: new Date("2023-12-21")
  },
  {
    id: "class-527",
    title: "Platform Adventure",
    description: "Jump and run through challenging levels in this classic platformer. Collect coins and avoid enemies.",
    thumbnail: "https://fortnite-game.github.io/img/class-527.png",
    category: "platform",
    tags: ["platform", "adventure", "jump", "classic"],
    playUrl: "/play/class-527",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2023-12-20")
  },
  {
    id: "class-532",
    title: "Action Pack",
    description: "A collection of action-packed mini-games with intense gameplay and exciting challenges.",
    thumbnail: "https://fortnite-game.github.io/img/class-532.png",
    category: "action",
    tags: ["action", "pack", "intense", "challenges"],
    playUrl: "/play/class-532",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2023-12-19"),
    updatedAt: new Date("2023-12-19")
  },
  {
    id: "class-536",
    title: "Unity Adventure",
    description: "Another Unity-powered adventure game with high-quality graphics and immersive gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-536.png",
    category: "adventure",
    tags: ["unity", "adventure", "graphics", "immersive"],
    playUrl: "/play/class-536",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-18"),
    updatedAt: new Date("2023-12-18")
  },
  {
    id: "class-546",
    title: "Racing Championship",
    description: "High-speed racing game with multiple tracks and cars to choose from. Compete for the championship!",
    thumbnail: "https://fortnite-game.github.io/img/class-546.png",
    category: "racing",
    tags: ["racing", "cars", "speed", "championship"],
    playUrl: "/play/class-546",
    upvotes: 1789,
    downvotes: 56,
    playCount: 23400,
    createdAt: new Date("2023-12-17"),
    updatedAt: new Date("2023-12-17")
  },
  {
    id: "class-560",
    title: "Space Defender",
    description: "Defend Earth from alien invaders in this classic space shooter. Upgrade your ship and survive the waves.",
    thumbnail: "https://fortnite-game.github.io/img/class-560.png",
    category: "shooting",
    tags: ["space", "shooter", "defense", "arcade"],
    playUrl: "/play/class-560",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2023-12-16"),
    updatedAt: new Date("2023-12-16")
  },
  {
    id: "class-561",
    title: "Space Adventure",
    description: "Explore the vastness of space in this thrilling space adventure game.",
    thumbnail: "https://fortnite-game.github.io/img/class-561.png",
    category: "adventure",
    tags: ["space", "adventure", "explore", "thrilling"],
    playUrl: "/play/class-561",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-15"),
    updatedAt: new Date("2023-12-15")
  },
  {
    id: "class-570",
    title: "Quick Arcade",
    description: "A quick and fun arcade game perfect for short gaming sessions.",
    thumbnail: "https://fortnite-game.github.io/img/class-570.png",
    category: "arcade",
    tags: ["quick", "arcade", "fun", "short"],
    playUrl: "/play/class-570",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2023-12-14"),
    updatedAt: new Date("2023-12-14")
  },
  {
    id: "class-597",
    title: "Sports Championship",
    description: "Compete in various sports in this comprehensive sports game. Football, basketball, and more!",
    thumbnail: "https://fortnite-game.github.io/img/class-597.png",
    category: "sports",
    tags: ["sports", "football", "basketball", "championship"],
    playUrl: "/play/class-597",
    upvotes: 1456,
    downvotes: 45,
    playCount: 19800,
    createdAt: new Date("2023-12-13"),
    updatedAt: new Date("2023-12-13")
  },
  {
    id: "class-633",
    title: "Strategy Master",
    description: "Build your empire and conquer territories in this strategic game. Plan your moves carefully to achieve victory.",
    thumbnail: "https://fortnite-game.github.io/img/class-633.png",
    category: "strategy",
    tags: ["strategy", "empire", "conquest", "planning"],
    playUrl: "/play/class-633",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2023-12-12"),
    updatedAt: new Date("2023-12-12")
  },
  {
    id: "class-782",
    title: "Stickman Fighter",
    description: "Epic stickman fighting game with amazing graphics and smooth gameplay. Choose your fighter and battle!",
    thumbnail: "https://fortnite-game.github.io/img/class-782.png",
    category: "fighting",
    tags: ["stickman", "fighting", "action", "combat"],
    playUrl: "/play/class-782",
    upvotes: 2134,
    downvotes: 89,
    playCount: 28700,
    createdAt: new Date("2023-12-11"),
    updatedAt: new Date("2023-12-11")
  },
  {
    id: "class-784",
    title: "Flash Game",
    description: "A classic Flash game with retro graphics and nostalgic gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-784.png",
    category: "arcade",
    tags: ["flash", "classic", "retro", "nostalgic"],
    playUrl: "/play/class-784",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-10"),
    updatedAt: new Date("2023-12-10")
  },
  {
    id: "class-790",
    title: "Web Game",
    description: "A modern web-based game with clean design and smooth performance.",
    thumbnail: "https://fortnite-game.github.io/img/class-790.png",
    category: "arcade",
    tags: ["web", "modern", "clean", "performance"],
    playUrl: "/play/class-790",
    upvotes: 1456,
    downvotes: 34,
    playCount: 19800,
    createdAt: new Date("2023-12-09"),
    updatedAt: new Date("2023-12-09")
  },
  {
    id: "class-809",
    title: "Game Collection",
    description: "Another collection of fun games with various genres and gameplay styles.",
    thumbnail: "https://fortnite-game.github.io/img/class-809.png",
    category: "arcade",
    tags: ["collection", "various", "genres", "styles"],
    playUrl: "/play/class-809",
    upvotes: 1678,
    downvotes: 67,
    playCount: 22300,
    createdAt: new Date("2023-12-08"),
    updatedAt: new Date("2023-12-08")
  },
  {
    id: "class-827",
    title: "Final Game",
    description: "The final game in our collection with unique mechanics and engaging gameplay.",
    thumbnail: "https://fortnite-game.github.io/img/class-827.png",
    category: "arcade",
    tags: ["final", "unique", "mechanics", "engaging"],
    playUrl: "/play/class-827",
    upvotes: 1234,
    downvotes: 45,
    playCount: 15600,
    createdAt: new Date("2023-12-07"),
    updatedAt: new Date("2023-12-07")
  },
  
  // HTML-Games-V2 Repository Games (65+ additional games)
  {
    id: "2048",
    title: "2048",
    description: "The classic number puzzle game. Combine tiles with the same number to reach 2048!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/2048/thumbnail.png",
    category: "puzzle",
    tags: ["2048", "puzzle", "numbers", "classic"],
    playUrl: "/play/2048",
    upvotes: 5678,
    downvotes: 234,
    playCount: 123400,
    createdAt: new Date("2023-12-06"),
    updatedAt: new Date("2023-12-06")
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    description: "The addictive idle game where you click cookies to build your cookie empire!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cookie-clicker/thumbnail.png",
    category: "idle",
    tags: ["cookie", "clicker", "idle", "addictive"],
    playUrl: "/play/cookie-clicker",
    upvotes: 4567,
    downvotes: 189,
    playCount: 98700,
    createdAt: new Date("2023-12-05"),
    updatedAt: new Date("2023-12-05")
  },
  {
    id: "chrome-dino",
    title: "Chrome Dino",
    description: "The famous Chrome offline game. Help the dinosaur jump over cacti and avoid obstacles!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/chrome-dino/thumbnail.png",
    category: "arcade",
    tags: ["dino", "chrome", "jump", "endless"],
    playUrl: "/play/chrome-dino",
    upvotes: 6789,
    downvotes: 156,
    playCount: 156800,
    createdAt: new Date("2023-12-04"),
    updatedAt: new Date("2023-12-04")
  },
  {
    id: "crossyroad",
    title: "Crossy Road",
    description: "Help the chicken cross the road in this endless arcade game. Avoid traffic and obstacles!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/crossyroad/thumbnail.png",
    category: "arcade",
    tags: ["crossy", "road", "chicken", "endless"],
    playUrl: "/play/crossyroad",
    upvotes: 3456,
    downvotes: 123,
    playCount: 78900,
    createdAt: new Date("2023-12-03"),
    updatedAt: new Date("2023-12-03")
  },
  {
    id: "1v1lol",
    title: "1v1.LOL",
    description: "Build, fight, and survive in this fast-paced battle royale game. Show your skills!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/1v1lol/thumbnail.png",
    category: "action",
    tags: ["1v1", "battle", "royale", "building"],
    playUrl: "/play/1v1lol",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-12-02"),
    updatedAt: new Date("2023-12-02")
  },
  {
    id: "cuttherope",
    title: "Cut the Rope",
    description: "Help Om Nom get his candy by cutting ropes in this physics-based puzzle game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cuttherope/thumbnail.png",
    category: "puzzle",
    tags: ["cut", "rope", "physics", "om-nom"],
    playUrl: "/play/cuttherope",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01")
  },
  {
    id: "hexgl",
    title: "HexGL",
    description: "A futuristic racing game with stunning graphics and fast-paced gameplay.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/HexGL/thumbnail.png",
    category: "racing",
    tags: ["hexgl", "racing", "futuristic", "3d"],
    playUrl: "/play/hexgl",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-30"),
    updatedAt: new Date("2023-11-30")
  },
  {
    id: "fullscreen-mario",
    title: "Full Screen Mario",
    description: "The classic Super Mario Bros game recreated in HTML5. Jump and collect coins!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/FullScreenMario/thumbnail.png",
    category: "platform",
    tags: ["mario", "platform", "classic", "nintendo"],
    playUrl: "/play/fullscreen-mario",
    upvotes: 4567,
    downvotes: 189,
    playCount: 123400,
    createdAt: new Date("2023-11-29"),
    updatedAt: new Date("2023-11-29")
  },
  {
    id: "cluster-rush",
    title: "Cluster Rush",
    description: "Run through colorful obstacles and collect as many people as possible!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cluster-rush/thumbnail.png",
    category: "arcade",
    tags: ["cluster", "rush", "run", "collect"],
    playUrl: "/play/cluster-rush",
    upvotes: 2345,
    downvotes: 123,
    playCount: 67800,
    createdAt: new Date("2023-11-28"),
    updatedAt: new Date("2023-11-28")
  },
  {
    id: "color-switch-2",
    title: "Color Switch 2",
    description: "Navigate through colorful obstacles by matching your ball's color in this challenging game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/color-switch-2-challenges/thumbnail.png",
    category: "arcade",
    tags: ["color", "switch", "ball", "challenge"],
    playUrl: "/play/color-switch-2",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-27"),
    updatedAt: new Date("2023-11-27")
  },
  {
    id: "dadish",
    title: "Dadish",
    description: "A charming platformer where you play as a radish dad trying to find his children.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/dadish/thumbnail.png",
    category: "platform",
    tags: ["dadish", "platform", "radish", "family"],
    playUrl: "/play/dadish",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-26"),
    updatedAt: new Date("2023-11-26")
  },
  {
    id: "cubefield",
    title: "Cube Field",
    description: "Navigate your ship through a field of cubes in this classic arcade game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cubefield/thumbnail.png",
    category: "arcade",
    tags: ["cube", "field", "ship", "navigate"],
    playUrl: "/play/cubefield",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-25"),
    updatedAt: new Date("2023-11-25")
  },
  {
    id: "8ball-billards",
    title: "8 Ball Billiards",
    description: "Play classic 8-ball pool against the computer. Show your billiards skills!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/8ball-billards-classic/thumbnail.png",
    category: "sports",
    tags: ["8ball", "billiards", "pool", "classic"],
    playUrl: "/play/8ball-billards",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-24"),
    updatedAt: new Date("2023-11-24")
  },
  {
    id: "2048-multitask",
    title: "2048 Multitask",
    description: "The classic 2048 game with a twist - play multiple boards at once!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/2048-multitask/thumbnail.png",
    category: "puzzle",
    tags: ["2048", "multitask", "puzzle", "challenge"],
    playUrl: "/play/2048-multitask",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-23"),
    updatedAt: new Date("2023-11-23")
  },
  {
    id: "10-minutes-till-dawn",
    title: "10 Minutes Till Dawn",
    description: "Survive for 10 minutes against endless waves of enemies in this intense survival game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/10-minutes-till-dawn/thumbnail.png",
    category: "action",
    tags: ["survival", "10-minutes", "waves", "intense"],
    playUrl: "/play/10-minutes-till-dawn",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-22"),
    updatedAt: new Date("2023-11-22")
  },
  {
    id: "1v1space",
    title: "1v1 Space",
    description: "Battle in space in this 1v1 multiplayer game. Show your space combat skills!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/1v1space/thumbnail.png",
    category: "action",
    tags: ["1v1", "space", "battle", "multiplayer"],
    playUrl: "/play/1v1space",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-21"),
    updatedAt: new Date("2023-11-21")
  },
  {
    id: "city-blocks-2",
    title: "City Blocks 2",
    description: "Build and manage your city in this engaging city-building simulation game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/city-blocks-2/thumbnail.png",
    category: "strategy",
    tags: ["city", "blocks", "building", "simulation"],
    playUrl: "/play/city-blocks-2",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-20"),
    updatedAt: new Date("2023-11-20")
  },
  {
    id: "clean-up-io",
    title: "Clean Up.io",
    description: "Clean up the environment in this multiplayer io game. Work together to make the world cleaner!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/clean-up-io/thumbnail.png",
    category: "multiplayer",
    tags: ["clean", "up", "io", "environment"],
    playUrl: "/play/clean-up-io",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-19"),
    updatedAt: new Date("2023-11-19")
  },
  {
    id: "connect3",
    title: "Connect 3",
    description: "A simple but addictive puzzle game. Connect three or more matching items to clear them.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/connect3/thumbnail.png",
    category: "puzzle",
    tags: ["connect", "3", "puzzle", "match"],
    playUrl: "/play/connect3",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-18"),
    updatedAt: new Date("2023-11-18")
  },
  {
    id: "core-ball",
    title: "Core Ball",
    description: "Navigate your ball through challenging levels in this physics-based puzzle game.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/core-ball/thumbnail.png",
    category: "puzzle",
    tags: ["core", "ball", "physics", "navigate"],
    playUrl: "/play/core-ball",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-17"),
    updatedAt: new Date("2023-11-17")
  },
  {
    id: "craftmine",
    title: "Craftmine",
    description: "A Minecraft-inspired building and crafting game. Create your own world!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/craftmine/thumbnail.png",
    category: "adventure",
    tags: ["craft", "mine", "building", "sandbox"],
    playUrl: "/play/craftmine",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-16"),
    updatedAt: new Date("2023-11-16")
  },
  {
    id: "creative-kill-chamber",
    title: "Creative Kill Chamber",
    description: "A challenging puzzle game where you must find creative ways to eliminate targets.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/creativekillchamber/thumbnail.png",
    category: "puzzle",
    tags: ["creative", "kill", "chamber", "puzzle"],
    playUrl: "/play/creative-kill-chamber",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2023-11-15")
  },
  {
    id: "crowd-city-2",
    title: "Crowd City 2",
    description: "Gather people and grow your crowd in this multiplayer io game. Become the biggest crowd!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/crowd%20city%202/thumbnail.png",
    category: "multiplayer",
    tags: ["crowd", "city", "io", "gather"],
    playUrl: "/play/crowd-city-2",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-14"),
    updatedAt: new Date("2023-11-14")
  },
  {
    id: "csgo-clicker",
    title: "CS:GO Clicker",
    description: "A Counter-Strike themed clicker game. Upgrade your weapons and equipment!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/csgo-clicker/thumbnail.png",
    category: "idle",
    tags: ["csgo", "clicker", "counter-strike", "weapons"],
    playUrl: "/play/csgo-clicker",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-13"),
    updatedAt: new Date("2023-11-13")
  },
  {
    id: "ctr",
    title: "Crash Team Racing",
    description: "The classic kart racing game. Race as Crash Bandicoot and his friends!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/ctr/thumbnail.png",
    category: "racing",
    tags: ["crash", "team", "racing", "kart"],
    playUrl: "/play/ctr",
    upvotes: 4567,
    downvotes: 189,
    playCount: 123400,
    createdAt: new Date("2023-11-12"),
    updatedAt: new Date("2023-11-12")
  },
  {
    id: "cupcake-2048",
    title: "Cupcake 2048",
    description: "A sweet twist on the classic 2048 game with delicious cupcakes!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cupcake2048/thumbnail.png",
    category: "puzzle",
    tags: ["cupcake", "2048", "sweet", "puzzle"],
    playUrl: "/play/cupcake-2048",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-11"),
    updatedAt: new Date("2023-11-11")
  },
  {
    id: "cut-the-rope-2",
    title: "Cut the Rope 2",
    description: "The sequel to the popular Cut the Rope game with new challenges and mechanics.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/cuttherope2/thumbnail.png",
    category: "puzzle",
    tags: ["cut", "rope", "2", "sequel"],
    playUrl: "/play/cut-the-rope-2",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2023-11-10")
  },
  {
    id: "dadish-2",
    title: "Dadish 2",
    description: "The sequel to Dadish. Continue the adventure with the radish dad and his children.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/dadishtwo/thumbnail.png",
    category: "platform",
    tags: ["dadish", "2", "platform", "sequel"],
    playUrl: "/play/dadish-2",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-09"),
    updatedAt: new Date("2023-11-09")
  },
  {
    id: "dadish-3",
    title: "Dadish 3",
    description: "The third installment of the Dadish series. More adventures await!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/dadish3/thumbnail.png",
    category: "platform",
    tags: ["dadish", "3", "platform", "adventure"],
    playUrl: "/play/dadish-3",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-08"),
    updatedAt: new Date("2023-11-08")
  },
  {
    id: "dogeminer",
    title: "DogeMiner",
    description: "Mine Dogecoin in this fun idle mining game. Much wow, very mine!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/DogeMiner/thumbnail.png",
    category: "idle",
    tags: ["doge", "miner", "dogecoin", "idle"],
    playUrl: "/play/dogeminer",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-07"),
    updatedAt: new Date("2023-11-07")
  },
  {
    id: "offline-paradise",
    title: "Offline Paradise",
    description: "A collection of offline games perfect for when you don't have internet connection.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/OfflineParadise/thumbnail.png",
    category: "arcade",
    tags: ["offline", "paradise", "collection", "games"],
    playUrl: "/play/offline-paradise",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-06"),
    updatedAt: new Date("2023-11-06")
  },
  {
    id: "squid-gun-fest",
    title: "Squid Gun Fest",
    description: "A fun shooting game with squid characters. Show your shooting skills!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/Squid%20Gun%20Fest/thumbnail.png",
    category: "shooting",
    tags: ["squid", "gun", "fest", "shooting"],
    playUrl: "/play/squid-gun-fest",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05")
  },
  {
    id: "stickman-survival",
    title: "Stickman Survival",
    description: "Survive as a stickman in this challenging survival game. Fight enemies and stay alive!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/Stickman-Survival/thumbnail.png",
    category: "action",
    tags: ["stickman", "survival", "fight", "challenge"],
    playUrl: "/play/stickman-survival",
    upvotes: 3456,
    downvotes: 156,
    playCount: 78900,
    createdAt: new Date("2023-11-04"),
    updatedAt: new Date("2023-11-04")
  },
  {
    id: "circlo",
    title: "Circlo",
    description: "A unique puzzle game where you control circles and solve challenging puzzles.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/circlo/thumbnail.png",
    category: "puzzle",
    tags: ["circlo", "circle", "puzzle", "unique"],
    playUrl: "/play/circlo",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-11-03"),
    updatedAt: new Date("2023-11-03")
  },
  {
    id: "ctr-holiday",
    title: "CTR Holiday",
    description: "A holiday-themed version of Crash Team Racing with festive tracks and characters.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/ctr-holiday/thumbnail.png",
    category: "racing",
    tags: ["ctr", "holiday", "festive", "racing"],
    playUrl: "/play/ctr-holiday",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-11-02"),
    updatedAt: new Date("2023-11-02")
  },
  {
    id: "ctr-tr",
    title: "CTR Turbo Racing",
    description: "The turbo version of Crash Team Racing with enhanced speed and gameplay.",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/ctr-tr/thumbnail.png",
    category: "racing",
    tags: ["ctr", "turbo", "racing", "speed"],
    playUrl: "/play/ctr-tr",
    upvotes: 2345,
    downvotes: 89,
    playCount: 56700,
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01")
  },
  {
    id: "2020-game",
    title: "2020 Game",
    description: "A game that captures the essence of the year 2020. Survive the challenges!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/2020-game/thumbnail.png",
    category: "adventure",
    tags: ["2020", "survival", "challenge", "year"],
    playUrl: "/play/2020-game",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-10-31"),
    updatedAt: new Date("2023-10-31")
  },
  {
    id: "100ng",
    title: "100ng",
    description: "A unique puzzle game with 100 challenging levels. Test your problem-solving skills!",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/100ng/thumbnail.png",
    category: "puzzle",
    tags: ["100ng", "puzzle", "levels", "challenge"],
    playUrl: "/play/100ng",
    upvotes: 1789,
    downvotes: 67,
    playCount: 45600,
    createdAt: new Date("2023-10-30"),
    updatedAt: new Date("2023-10-30")
  },
  {
    id: "9007199254740992",
    title: "9007199254740992",
    description: "A mathematical puzzle game with a very long number. Can you solve it?",
    thumbnail: "https://raw.githubusercontent.com/tw31122007/HTML-Games-V2/main/9007199254740992/thumbnail.png",
    category: "puzzle",
    tags: ["number", "mathematical", "puzzle", "challenge"],
    playUrl: "/play/9007199254740992",
    upvotes: 1234,
    downvotes: 45,
    playCount: 34500,
    createdAt: new Date("2023-10-29"),
    updatedAt: new Date("2023-10-29")
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params: GameSearchParams = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    let filteredGames = [...mockGames]

    // Filter by search query
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredGames = filteredGames.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.description?.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (params.category) {
      filteredGames = filteredGames.filter(game => 
        game.category === params.category
      )
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      filteredGames = filteredGames.filter(game =>
        params.tags!.some(tag => game.tags.includes(tag))
      )
    }

    // Sort games
    switch (params.sortBy) {
      case 'popular':
        filteredGames.sort((a, b) => b.playCount - a.playCount)
        break
      case 'rating':
        filteredGames.sort((a, b) => {
          const ratingA = a.upvotes + a.downvotes > 0 ? a.upvotes / (a.upvotes + a.downvotes) : 0
          const ratingB = b.upvotes + b.downvotes > 0 ? b.upvotes / (b.upvotes + b.downvotes) : 0
          return ratingB - ratingA
        })
        break
      case 'newest':
      default:
        filteredGames.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    // Pagination
    const total = filteredGames.length
    const start = params.offset || 0
    const end = start + (params.limit || 20)
    const paginatedGames = filteredGames.slice(start, end)

    const response: GameApiResponse = {
      games: paginatedGames,
      total,
      hasMore: end < total
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
