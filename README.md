<p align="center">
  <a href="https://github.com/daffineq/kuroji-api">
    <img src="https://raw.githubusercontent.com/veaquer/kuroji-api/main/public/img/logo.svg" alt="Logo" width="100%" style="max-height: 300px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
  </a>
</p>

<h1 align="center">Kuroji API v2</h1>

<p align="center">
  <strong>🚀 A modern anime API that doesn't suck</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white" alt="Bun"></a>
  <a href="#"><img src="https://img.shields.io/badge/Elysia-FD4F00?style=flat&logo=elysia&logoColor=white" alt="Elysia"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white" alt="GraphQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

---

## What's This?

Kuroji API is a fast, modern anime database API that aggregates data from multiple sources. You get REST endpoints, GraphQL queries, rate limiting, API keys - basically everything you need. Built with tech that actually makes development enjoyable.

**Data Sources:**
- AniList - Primary anime database
- Crysoline API
- Kitsu
- Shikimori
- TMDB (The Movie Database)
- TVDB (TheTVDB)

**Important:** You need to index anime data before you can query it. Think of it as setting up your own anime database - you populate it first, then search through it.

---

## Getting Started

### Installation
```bash
# Clone the repo
git clone https://github.com/daffineq/kuroji-api.git
cd kuroji-api

# Install dependencies (using Bun because it's fast)
bun install

# Set up your environment
cp .env.example .env
# Edit .env with your config (database, API keys, etc.)

# Generate Prisma client
bun run generate

# Run migrations
bun run migrate
```

### Running the Server
```bash
# Development mode (with hot reload)
bun run dev

# Production mode
bun run prod
```

Server runs at `http://localhost:3000` by default (or whatever PORT you set)

---

## How It Works

### Step 1: Index Your Anime 📚

Before you can query anything, you need to index anime from your data providers. The indexer fetches anime data from multiple sources and stores it in your database.
```bash
# Start the indexer (fetches 50 anime per page)
curl -X POST "http://localhost:3000/api/anime/indexer/start?delay=5"

# The delay parameter controls wait time between requests (in seconds)
# Lower delay = faster indexing, but be respectful to the provider APIs
```

What the indexer does:
- Fetches anime IDs from AniList (primary source)
- Gets full details from all configured providers (AniList, Crysoline API, Kitsu, Shikimori, TMDB, TVDB)
- Aggregates and stores the data in your database
- Continues until everything is indexed (or you stop it)

**Managing the indexer:**
```bash
# Stop indexing
curl -X POST "http://localhost:3000/api/anime/indexer/stop"

# Reset to start from page 1 again
curl -X POST "http://localhost:3000/api/anime/indexer/reset"
```

### Step 2: Query Your Data 🔍

Once you have indexed data, you can query it using GraphQL or REST.

#### GraphQL (Recommended)

Visit the GraphQL Playground at `http://localhost:3000/graphql`:
```graphql
# Get a single anime
query {
  anime(id: 1) {
    id
    title {
      romaji
      english
      native
    }
    description
    status
    episodes
    score
    popularity
    genres {
      name
    }
  }
}

# Search with filters
query {
  animes(
    page: 1
    per_page: 20
    search: "Attack on Titan"
    status: "RELEASING"
    sort: [POPULARITY_DESC]
  ) {
    data {
      id
      title {
        romaji
      }
      score
      popularity
    }
    page_info {
      total
      current_page
      has_next_page
    }
  }
}
```

### Step 3: API Keys (Optional) 🔑

If you've enabled API key authentication:
```bash
# Generate a new API key (requires admin key)
curl -X POST "http://localhost:3000/api/api-key/generate" \
  -H "x-api-key: YOUR_ADMIN_KEY"

# Get info about your API key
curl "http://localhost:3000/api/api-key" \
  -H "x-api-key: YOUR_API_KEY"
```

---

## Documentation

Check out the interactive documentation for all available endpoints:

- **Scalar UI**: `http://localhost:3000/docs` - Clean, modern API docs with all routes
- **OpenAPI JSON**: `http://localhost:3000/docs/openapi` - Raw OpenAPI schema
- **GraphQL Playground**: `http://localhost:3000/graphql` - Interactive GraphQL interface

---

## Configuration

Check `.env.example` for all available settings

---

## Features

- **Data Indexing** - Automatically fetch and store anime from multiple providers
- **Rate Limiting** - Protect your API from abuse
- **API Key Management** - Secure your endpoints
- **Documentation** - Auto-generated, interactive docs
- **CORS Support** - Configure who can access your API

---

## Tech Stack

- **[Elysia](https://elysiajs.com/)** - Fast, modern web framework
- **[Bun](https://bun.sh/)** - High-performance JavaScript runtime
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Prisma](https://www.prisma.io/)** - Modern database ORM
- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** - Flexible GraphQL server
- **[Scalar](https://github.com/scalar/scalar)** - Beautiful API documentation

---

## Scripts
```bash
# Development
bun run dev              # Start with hot reload
bun run prod             # Production mode

# Database
bun run migrate          # Deploy migrations
bun run migrate:dev      # Create and apply new migration
bun run reset            # Reset database (⚠️ destructive)

# Prisma
bun run generate         # Generate Prisma client
bun run merge            # Merge Prisma schemas
bun run mrgn             # Merge and generate

# Type checking
bun run tsc              # Watch mode type checking
```

---

## Contributing

Contributions are welcome! Here's how:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Credits

- Built with [Elysia](https://elysiajs.com/)
- Powered by [Bun](https://bun.sh/)
- Documentation by [Scalar](https://github.com/scalar/scalar)

---

<p align="center">
  Made by <a href="https://github.com/daffineq">daffineq</a>
</p>

<p align="center">
  <a href="https://github.com/daffineq/kuroji-api/stargazers">⭐ Star this repo if you find it useful</a>
</p>
