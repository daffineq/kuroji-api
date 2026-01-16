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
  <a href="#"><img src="https://img.shields.io/badge/Drizzle-C5F74F?style=flat&logo=drizzle&logoColor=black" alt="Drizzle"></a>
  <a href="#"><img src="https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white" alt="GraphQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

---

## Try It Out - Public Demo Instance

Want to test the API without setting anything up? I've got a demo instance running:

**Base URL:** `https://kuroji-api-j4mh.onrender.com`

**IMPORTANT - READ THIS:**
- **Rate Limit:** 10 requests per minute (be respectful!)
- **Purpose:** This is ONLY for testing and playing around
- **NOT for production:** Don't build real apps on this instance
- **Please be cool:** If you abuse it, I'll have to take it down for everyone

**Quick Start:**
```bash
# Browse the docs
open https://kuroji-api-j4mh.onrender.com/docs

# Try GraphQL playground
open https://kuroji-api-j4mh.onrender.com/graphql
```

**Want your own instance?** Follow the [Free Hosting](#free-hosting-) guide below to deploy your own!

---

## Requirements

- **Memory:**  
  - **Minimum:** 500MB–1GB (may be sufficient for small datasets or high `ANIME_POPULARITY_THRESHOLD`)
  - **Recommended:** 2GB–4GB (for larger datasets or low `ANIME_POPULARITY_THRESHOLD`)
  - Actual memory usage depends on your `.env` configuration, especially `ANIME_POPULARITY_THRESHOLD` and other indexing/query settings. Lower thresholds and larger datasets require more memory; higher thresholds or indexing fewer anime will need less.  
  - Running with less than 500MB may cause crashes or slow performance, especially during indexing or heavy queries.

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

#### Fast Docker Compose Install

If you want to get started quickly using Docker Compose (recommended for most users):

```bash
# Clone the repo
git clone https://github.com/daffineq/kuroji-api.git
cd kuroji-api

# Copy environment file and edit as needed
cp .env.example .env
# Edit .env with your config (database, API keys, etc.)

# Start everything with Docker Compose
docker compose up --build -d
```

This will build and start all required services (API, database, etc.) automatically. Make sure Docker is installed and running.

#### Manual (Bun) Install

```bash
# Install dependencies (using Bun because it's fast)
bun install

# Set up your environment
cp .env.example .env
# Edit .env with your config (database, API keys, etc.)

# Generate Drizzle types
bun run db:generate

# Run migrations
bun run db:migrate
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

## Free Hosting 🚀

Want to host this for FREE? Here's the setup that actually works.

### Hosting on Render (Recommended)

After testing multiple free hosting platforms, Render is the most reliable option for this project.

#### Prerequisites

Before deploying to Render, you'll need a database and optionally Redis:

**1. Database - Neon (Required)**
- Sign up at [Neon](https://neon.tech)
- Free tier includes 500MB PostgreSQL database (sufficient for most use cases)
- Create a new project and copy your connection string
- Format: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

**2. Redis - Upstash (Optional)**
- Create account at [Upstash](https://upstash.com)
- Set up a new Redis database (free tier available)
- Copy your connection URL
- Format: `redis://default:password@xxx.upstash.io:6379`
- Note: Redis is optional but recommended for better rate limiting and caching

#### Deployment Steps

1. **Create Render Account**
   - Go to [Render](https://render.com) and sign up
   - Connect your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Kuroji API repository
   - Choose a service name

3. **Configure Build Settings**
   - **Environment:** Select `Docker`
   - **Dockerfile Path:** `./Dockerfile.render` ⚠️ Important: Use the `.render` variant, not the standard Dockerfile
   - **Region:** Choose closest to your location
   - **Instance Type:** Free

4. **Environment Variables**
   
   Click "Advanced" and add these environment variables:

   **Required:**
   ```
   DATABASE_URL=your_neon_connection_string
   PORT=3000
   NODE_ENV=production
   RENDER=true
   ANIME_POPULARITY_THRESHOLD=3000
   ```

   **Recommended:**
   ```
   REDIS_URL=your_upstash_redis_url
   CACHING_ENABLED=true
   REDIS_TTL=900
   RATE_LIMIT=100
   RATE_LIMIT_TTL=60
   ADMIN_KEY=create_a_secure_admin_key
   API_KEY_STRATEGY=not_required
   ```

   **Optional API Keys:**
   ```
   TMDB_API_KEY=your_tmdb_key
   TVDB_API_KEY=your_tvdb_key
   CRYSOLINE_API_KEY=your_crysoline_key
   ```

   See the `.env.example` file in the repository for complete configuration options.

5. **Deploy**
   - Click "Create Web Service"
   - Initial build takes 5-10 minutes
   - You'll receive a URL: `https://your-service-name.onrender.com`

#### Post-Deployment Setup

After successful deployment, initialize your anime database:

```bash
# Start the indexer (use your Render URL)
curl -X POST "https://your-service-name.onrender.com/api/anime/indexer/start?delay=5"

# Access documentation at
https://your-service-name.onrender.com/docs

# GraphQL playground at
https://your-service-name.onrender.com/graphql
```

### Important Considerations

- **Free Tier Limitations:** Services spin down after 15 minutes of inactivity. First request after spindown takes 30-60 seconds to wake up. Setting `RENDER=true` enables self-polling to keep the service active.
- **Build Timeouts:** If builds timeout, try deploying during off-peak hours
- **Database Limits:** Monitor Neon's 500MB limit. Adjust `ANIME_POPULARITY_THRESHOLD` higher (e.g., 3000-5000) to index fewer anime and stay within limits
- **Memory Constraints:** Free tier provides 512MB RAM. Set `ANIME_POPULARITY_THRESHOLD` appropriately to avoid memory issues

### Troubleshooting

**Build Failures:**
- Verify you selected `./Dockerfile.render` (not `Dockerfile`)
- Confirm `DATABASE_URL` is correctly formatted
- Check Render build logs for specific errors

**Runtime Crashes:**
- Review application logs in Render dashboard
- Verify all required environment variables are set
- Ensure `DATABASE_URL` is accessible from Render

**Slow Indexing:**
- Expected on free tier due to resource constraints
- Increase `delay` parameter (e.g., `delay=10`) to reduce rate limiting
- Consider higher `ANIME_POPULARITY_THRESHOLD` to index fewer anime

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

Check `.env.example` for all available settings. Key configuration options:

### App Settings
- `PORT` - Server port (default: 3000)
- `PUBLIC_URL` - Public API URL for external access
- `CORS` - Allowed origins (comma-separated or `*` for all)

### Indexing & Updates
- `ANIME_POPULARITY_THRESHOLD` - Skip anime below this popularity count (default: 1500)
- `ANIME_UPDATE_ENABLED` - Enable automatic anime updates
- `ANIME_INDEXER_UPDATE_ENABLED` - Enable indexer updates

### External APIs
Configure endpoints and API keys for:
- AniList, Shikimori, Kitsu, TMDB, TVDB, Crysoline API
- Most services work without API keys, but keys provide higher rate limits

### Security & Rate Limiting
- `API_KEY_STRATEGY` - `all_routes` (require keys) or `not_required` (default)
- `ADMIN_KEY` - Master key with full API access
- `RATE_LIMIT` - Requests per window (0 = disabled)
- `RATE_LIMIT_TTL` - Time window in seconds

### Caching
- `CACHING_ENABLED` - Enable Redis caching
- `REDIS_URL` - Redis connection string
- `REDIS_TTL` - Cache duration in seconds (default: 900)

### Database
- `DATABASE_URL` - PostgreSQL connection string
- `TRANSACTION_BATCH` - Operations per batch (default: 10)

### Hosting Flags
- `VERCEL` - Set to `true` if deploying on Vercel
- `RENDER` - Set to `true` if deploying on Render (enables self-polling)

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
- **[Drizzle](https://orm.drizzle.team/)** - Modern database ORM
- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** - Flexible GraphQL server
- **[Scalar](https://github.com/scalar/scalar)** - Beautiful API documentation

---

## Scripts
```bash
# Development
bun run dev              # Start with hot reload
bun run prod             # Production mode

# Database (Drizzle)
bun run db:generate      # Generate migrations from schema
bun run db:migrate       # Apply pending migrations
bun run db:push          # Push schema changes directly (dev only)
bun run db:pull          # Pull schema from database
bun run db:up            # Check migration status
bun run db:studio        # Open Drizzle Studio (database GUI)

# Database Management
bun run db:truncate      # Clear all data (keeps schema)
bun run db:drop          # Drop all tables (⚠️ destructive)

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
