# Farm Building Game

A multiplayer web-based farm-building game where players can:
- Build and manage their own farms
- Plant crops and raise animals
- Trade items with other players in real-time
- Interact with friends in a shared game world

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit files.

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable React components
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
└── .eslintrc.json          # ESLint configuration
```

## Features (Implemented ✅ / To Be Implemented)

- ✅ User authentication and profiles
- ✅ Farm management system (5 levels)
- ✅ Crop and animal management
- ✅ Level up notifications and automatic rewards
- ✅ Leaderboard system
- [ ] Trading/marketplace system
- [ ] Real-time multiplayer interactions
- ✅ Inventory management
- ✅ Achievement/progression system
- [ ] Social features

## Development Notes

This project uses:
- **App Router** for file-based routing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality

## License

MIT