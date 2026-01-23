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

## Try It Out - Public Demo

**Base URL:** `https://kuroji-api-j4mh.onrender.com`

**⚠️ HEADS UP:**
- Rate limited to 10 req/min - don't abuse it
- Testing ONLY - don't build production apps on this
- If you're gonna use this fr, deploy your own instance, it's easy!

```bash
# Check the docs
open https://kuroji-api-j4mh.onrender.com/docs

# GraphQL playground
open https://kuroji-api-j4mh.onrender.com/graphql
```

---

## What's This?

Fast anime database API that pulls from multiple sources (AniList, Kitsu, Shikimori, TMDB, TVDB, Crysoline). REST + GraphQL, rate limiting, API keys - the whole package.

**Important:** You gotta index anime data before querying.

---

## Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/daffineq/kuroji-api.git
cd kuroji-api
cp .env.example .env
# Edit .env with your config
docker compose up --build -d
```

### Manual Install

```bash
bun install
cp .env.example .env
# Edit .env with your config
bun run db:generate
bun run db:migrate
bun run dev  # or bun run prod
```

Server runs at `http://localhost:3000`

---

## How to Use

### 1. Index Your Data

```bash
# Start indexing (delay in seconds between requests)
curl -X POST "http://localhost:3000/api/anime/indexer/start?delay=5"

# Stop it
curl -X POST "http://localhost:3000/api/anime/indexer/stop"

# Reset to page 1
curl -X POST "http://localhost:3000/api/anime/indexer/reset"
```

### 2. Query Your Data

Hit up the GraphQL playground at `http://localhost:3000/graphql` and play around with queries yourself.

Or check the REST docs at `http://localhost:3000/docs`

### 3. API Keys (Optional)

```bash
# Generate key (needs admin key)
curl -X POST "http://localhost:3000/api/api-key/generate" \
  -H "x-api-key: YOUR_ADMIN_KEY"
```

---

## Free Hosting on Render

### Prerequisites

**Database - Neon (Required)**
- Sign up at [Neon](https://neon.tech)
- Free 500MB PostgreSQL
- Copy connection string

**Redis - Upstash (Optional but recommended)**
- Create account at [Upstash](https://upstash.com)
- Copy Redis URL

### Deploy

1. Create account at [Render](https://render.com)
2. New Web Service → Connect your repo
3. **Important:** Set environment to `Docker` and Dockerfile path to `./Dockerfile.render`
4. Add your environment variables (check `.env.example` for all options)
5. Deploy

**Key env vars:**
```
DATABASE_URL=your_neon_url
RENDER=true
ANIME_POPULARITY_THRESHOLD=7500
```

After deploy, start the indexer:
```bash
curl -X POST "https://your-app.onrender.com/api/anime/indexer/start?delay=5"
```

**Free tier heads up:**
- Spins down after 15min inactivity, unless you set RENDER to true
- 512MB RAM - adjust `ANIME_POPULARITY_THRESHOLD` accordingly
- Neon free tier = 500MB storage

---

## Configuration

Check **[.env.example](.env.example)** - it's already documented with everything you need to know.

**Memory Requirements:**
- Minimum: 500MB-1GB
- Recommended: 2GB-4GB
- Depends on your `ANIME_POPULARITY_THRESHOLD` setting

---

## Scripts

```bash
# Dev
bun run dev              # Hot reload
bun run prod             # Production

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:studio        # Database GUI
bun run db:truncate      # Clear data
bun run db:drop          # Drop tables (⚠️)
```

---

## Tech Stack

- **[Elysia](https://elysiajs.com/)**
- **[Bun](https://bun.sh/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Drizzle](https://orm.drizzle.team/)**
- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)**
- **[Scalar](https://github.com/scalar/scalar)**

---

## Contributing

Fork it, branch it, commit it, push it, PR it.

---

## License

**[MIT](LICENSE)** - do whatever you want

---

<p align="center">
  Made by <a href="https://github.com/daffineq">daffineq</a>
</p>

<p align="center">
  <a href="https://github.com/daffineq/kuroji-api/stargazers">⭐ Star this if it's useful</a>
</p>
