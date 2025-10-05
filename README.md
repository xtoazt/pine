## Firestore Rules

This repo includes Firestore security rules in `firestore.rules` suitable for the app:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }
    match /friendships/{friendshipId} {
      allow read: if request.auth != null && (request.resource.data.users.hasAny([request.auth.uid]) || resource.data.users.hasAny([request.auth.uid]));
      allow create: if request.auth != null && request.resource.data.users is list && request.resource.data.users.size() == 2 && request.resource.data.users.hasAny([request.auth.uid]);
      allow update, delete: if request.auth != null && resource.data.users.hasAny([request.auth.uid]);
    }
    match /directMessages/{messageId} {
      allow read, update, delete: if request.auth != null && resource.data.participants.hasAny([request.auth.uid]);
      allow create: if request.auth != null && request.resource.data.participants is list && request.resource.data.participants.size() == 2 && request.resource.data.participants.hasAny([request.auth.uid]);
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

Deploy via:

```bash
firebase deploy --only firestore:rules
```

# pine 🎮

A modern, developer-friendly game platform built with React, TypeScript, and shadcn/ui. No ads, no tracking, just pure gaming fun.

## ✨ Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Developer-Friendly API**: Simple REST API with no authentication required
- **TypeScript**: Fully typed for better development experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **No Ads**: Clean, ad-free experience
- **Open Source**: Free to use and modify

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xtoazt/pine.git
cd pine
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

The pine API provides easy access to our game collection with no authentication required.

### Base URL
```
/api
```

### Endpoints

#### Get Games
```http
GET /api/games
```

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category
- `tags` - Filter by tags (comma-separated)
- `limit` - Number of results (default: 20)
- `offset` - Skip results (default: 0)
- `sortBy` - Sort by: `newest`, `popular`, `rating`

**Example:**
```bash
curl "http://localhost:3000/api/games?category=action&limit=10"
```

#### Get Categories
```http
GET /api/categories
```

#### Get Platform Stats
```http
GET /api/stats
```

### Example Response

```json
{
  "games": [
    {
      "id": "class-782",
      "title": "Stickman Fighter",
      "description": "Epic stickman fighting game...",
      "thumbnail": "https://top-vaz-online.github.io/img/class-782.png",
      "category": "fighting",
      "tags": ["stickman", "fighting", "action"],
      "playUrl": "/play/class-782",
      "upvotes": 1250,
      "downvotes": 45,
      "playCount": 15600,
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 500,
  "hasMore": true
}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
pine/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── category/       # Category pages
│   │   ├── play/           # Game player pages
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── game/          # Game-related components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── source/               # Game source files
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohan** - [GitHub](https://github.com/rohan)

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Made with ❤️ by Rohan. No ads, no tracking, just pure gaming fun.
