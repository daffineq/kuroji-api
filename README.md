<p align="center">
  <a href="https://github.com/daffineq/kuroji-api">
    <img src="https://raw.githubusercontent.com/veaquer/kuroji-api/main/public/img/logo.svg" alt="Logo" width="100%" style="max-height: 300px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
  </a>
</p>

<h1 align="center">Kuroji API - Anime API</h1>

<p align="center">
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/Built%20with-NestJS-ea2845" alt="Built with NestJS"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

<p align="center">Kuroji API is a powerful and flexible API for accessing anime information, streaming sources, and related content from various providers.</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Hosting on Vercel](#-hosting-on-vercel)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Acknowledgments](#-acknowledgments)
- [License](#-license)

---

## 🔍 Overview

Kuroji API is built on NestJS and TypeScript, providing a robust and scalable solution for anime-related applications. The API allows you to access anime information, streaming sources, and more from various providers in a unified interface.

## ✨ Features

- 🔍 **Comprehensive Anime Data**: Search and retrieve detailed anime information
- 🎬 **Multiple Streaming Sources**: Access content from AnimePahe, AnimeKai, Zoro, and more
- 📅 **Scheduling**: Get airing schedules and updates for current anime
- 🌐 **External Integrations**: Support for TMDB, TVDB, and Shikimori data
- 🛠️ **Management Tools**: Monitor exceptions, logs, and database indexing
- 📊 **Advanced Filtering**: Filter anime based on numerous criteria like genre, status, format

## 🚀 Installation

```bash
# Clone the repository
$ git clone https://github.com/daffineq/kuroji-api.git
$ cd kuroji-api

# Install dependencies
$ bun install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your API keys and database settings

# Run database migrations
$ npx prisma migrate dev

# Start the server
$ bun start:dev
```

<details>
<summary><h2>🏗️ Hosting on Vercel</h2></summary>

To deploy this API on Vercel, you'll need to set up your databases first. Here's a step-by-step guide:

### 1. Database Setup

#### PostgreSQL (Required)

You'll need a PostgreSQL database with recommended 5GB of storage. Here are some free/affordable options:

- [Neon](https://neon.tech) - Serverless PostgreSQL with a generous free tier (3GB storage)
- [Supabase](https://supabase.com) - Open source Firebase alternative with PostgreSQL (500MB free tier)
- [Railway](https://railway.app) - Platform for deploying databases (1GB free tier)
- [ElephantSQL](https://www.elephantsql.com) - Managed PostgreSQL hosting (20MB free tier)

#### Redis (Optional)

Redis is used for caching and can be disabled in the `.env` file. If you want to use it, here are some free options:

- [Upstash](https://upstash.com) - Serverless Redis with a generous free tier
- [Redis Cloud](https://redis.com/try-free/) - Managed Redis by Redis Labs (30MB free tier)
- [Memoria](https://memoria.dev) - Serverless Redis alternative (100MB free tier)

### 2. Vercel Deployment

1. Fork this repository to your GitHub account
2. Create a new project on [Vercel](https://vercel.com)
3. Import your forked repository
4. Configure the following environment variables in Vercel:

   ```
   DATABASE_URL=your_postgresql_connection_string

   # Optional
   REDIS_USERNAME=your_redis_username
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password

   CORS=your_allowed_origins
   ```

5. Deploy!

> **Note**: Make sure to set up your database indexes after deployment by calling the indexing endpoint.

### 3. Post-Deployment

After deploying to Vercel:

1. Wait for the build to complete
2. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Start the indexing process:
   ```
   PUT https://your-vercel-domain.vercel.app/api/anime/index
   ```

> **Warning**: The indexing process can take several days to complete. Make sure your database has enough storage and your Vercel deployment has sufficient resources.

</details>

## 🏁 Getting Started

> **Important**: This API requires PostgreSQL to be running. Redis is optional and can be turned off in the `.env` file (enabled by default). Make sure these services are properly configured in your `.env` file.

### 🔒 CORS Configuration

You can configure Cross-Origin Resource Sharing (CORS) by setting the `CORS` environment variable in your `.env` file. This variable should contain a comma-separated list of allowed origins:

```
# Allow specific domains
CORS=http://localhost:3000,https://your-app-domain.com

# Allow all origins (not recommended for production)
CORS=*
```

### 🐳 Quick Start with Docker

You can quickly start the entire application stack (App, PostgreSQL, and Redis) using Docker:

```bash
# Start all services in detached mode
$ docker-compose up --build -d
```

The API will be available at: http://localhost:3000

> **Note**: This requires Docker to be installed and running on your system. The above command will start the Kuroji API server along with PostgreSQL and Redis with the configuration specified in the docker-compose.yml file.

### 💻 Development Setup

For a quicker development workflow, you can run just the PostgreSQL and Redis services using the basic Docker Compose file:

```bash
# Start only PostgreSQL and Redis
$ docker-compose -f docker-compose.basic.yml up --build -d
```

Then run the API locally with:

```bash
# For development with hot-reload
$ yarn start:dev

# Or for production mode
$ yarn start
```

This approach is faster for development as it avoids rebuilding the Docker container for the API when you make code changes.

### 📊 Database Indexing

Before you can retrieve anime data, you must first populate the database using one of these methods:

1. **Automatic Indexing**: Trigger the database indexing process with:

   ```
   PUT /api/anime/index
   ```

   This will start populating your database with anime information.

   > **Warning**: The full indexing process can take over 3 days to complete depending on your system resources and network conditions.

2. **Manual Addition**: Add specific anime to your database by fetching their details:
   ```
   GET /api/anime/info/:id
   ```

The API will only return information for anime that have been indexed in your database. If you're setting up the API for the first time, make sure to run the indexing process after installation.

## 📘 API Documentation

The Kuroji API provides a comprehensive set of endpoints for accessing anime data from various sources. Each section below can be expanded for details.

<details>
<summary><h3>🎬 Anime Endpoints</h3></summary>

<details>
<summary><b>Get Anime Info</b> - <code>GET /api/anime/info/:id</code></summary>

Get detailed information about an anime by its ID.

**Example:**

```
GET https://api.example.com/api/anime/info/21
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Anime Artworks</b> - <code>GET /api/anime/info/:id/artworks</code></summary>

Get artwork information for an anime from TVDB.

**Example:**

```
GET https://api.example.com/api/anime/info/21/artworks
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Anime Recommendations</b> - <code>GET /api/anime/info/:id/recommendations</code></summary>

Get anime recommendations based on an anime ID.

**Example:**

```
GET https://api.example.com/api/anime/info/21/recommendations?page=1&perPage=10&sort=popularity_desc
```

**Parameters:**

- `id` (path): Anime ID (required)
```typescript
// FilterDto
{
  // Pagination
  page?: number;            // Page number for results
  perPage?: number;         // Number of results per page

  // Basic filters
  id?: number;              // Filter by Anilist ID
  idIn?: number[];          // Filter by multiple Anilist IDs
  idNot?: number;           // Exclude specific Anilist ID
  idNotIn?: number[];       // Exclude multiple Anilist IDs

  // Search and query
  query?: string;           // Text search query

  // MAL-specific filters
  idMal?: number;           // Filter by MyAnimeList ID
  idMalIn?: number[];       // Filter by multiple MAL IDs
  idMalNot?: number;        // Exclude specific MAL ID
  idMalNotIn?: number[];    // Exclude multiple MAL IDs

  // Type filter
  type?: "ANIME" | "MANGA"; // Media type

  // Format filters
  format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
  formatIn?: string[];      // Include multiple formats
  formatNot?: string;       // Exclude specific format
  formatNotIn?: string[];   // Exclude multiple formats

  // Status filters
  status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
  statusIn?: string[];      // Include multiple statuses
  statusNot?: string;       // Exclude specific status
  statusNotIn?: string[];   // Exclude multiple statuses

  // Season filters
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";

  // Source material filters
  sourceIn?: ("ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" |
              "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME")[];

  // Language in which anime available
  language?: "sub" | "dub" | "both" | "raw";

  // Content filters
  isAdult?: boolean;        // Filter adult content
  isLicensed?: boolean;     // Filter licensed content
  countryOfOrigin?: string; // Filter by country code
  nsfw?: boolean;           // Filter NSFW content
  ageRating?: ("G" | "PG" | "R" | "R18")[];  // Filter by age rating

  // Date filters
  startDateGreater?: string; // After this date (YYYY-MM-DD)
  startDateLesser?: string;  // Before this date (YYYY-MM-DD)
  startDateLike?: string;    // Similar to this date
  endDateGreater?: string;   // After this date (YYYY-MM-DD)
  endDateLesser?: string;    // Before this date (YYYY-MM-DD)
  endDateLike?: string;      // Similar to this date

  // Airing filters
  airingAtGreater?: number;  // After this timestamp (Unix timestamp)
  airingAtLesser?: number;   // Before this timestamp (Unix timestamp)

  // Number filters
  episodesGreater?: number; // More than this many episodes
  episodesLesser?: number;  // Less than this many episodes
  durationGreater?: number; // Longer than this (minutes)
  durationLesser?: number;  // Shorter than this (minutes)

  // Popularity/score filters
  popularityGreater?: number; // Higher popularity than this
  popularityLesser?: number;  // Lower popularity than this
  popularityNot?: number;     // Not this popularity value
  scoreGreater?: number;      // Higher score than this
  scoreLesser?: number;       // Lower score than this
  scoreNot?: number;          // Not this score value

  // People filters
  characterIn?: string[];     // Include anime with these characters
  voiceActorIn?: string[];    // Include anime with these voice actors
  studioIn?: string[];        // Include anime by these studios

  // Tag/genre filters
  genreIn?: string[];         // Include these genres
  genreNotIn?: string[];      // Exclude these genres
  tagIn?: string[];           // Include these tags
  tagNotIn?: string[];        // Exclude these tags
  tagCategoryIn?: string[];   // Include these tag categories
  tagCategoryNotIn?: string[]; // Exclude these tag categories

  // Sort options
  sort?: string[];           // Sort options
                             // Available options: id, id_desc, title_romaji, title_romaji_desc,
                             // title_english, title_english_desc, title_native, title_native_desc,
                             // type, type_desc, format, format_desc, start_date, start_date_desc,
                             // end_date, end_date_desc, score, score_desc, popularity, popularity_desc,
                             // trending, trending_desc, episodes, episodes_desc, duration, duration_desc,
                             // status, status_desc, updated_at, updated_at_desc
}
```
</details>

<details>
<summary><b>Get Anime Characters</b> - <code>GET /api/anime/info/:id/characters</code></summary>

Get characters from an anime.

**Example:**

```
GET https://api.example.com/api/anime/info/21/characters?page=1&perPage=20
```

**Parameters:**

- `id` (path): Anime ID (required)
- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Get Anime Chronology</b> - <code>GET /api/anime/info/:id/chronology</code></summary>

Get chronological order of related anime.

**Example:**

```
GET https://api.example.com/api/anime/info/21/chronology?page=1&perPage=10&sort=start_date
```

**Parameters:**

- `id` (path): Anime ID (required)
```typescript
// FilterDto
{
  // Pagination
  page?: number;            // Page number for results
  perPage?: number;         // Number of results per page

  // Basic filters
  id?: number;              // Filter by Anilist ID
  idIn?: number[];          // Filter by multiple Anilist IDs
  idNot?: number;           // Exclude specific Anilist ID
  idNotIn?: number[];       // Exclude multiple Anilist IDs

  // Search and query
  query?: string;           // Text search query

  // MAL-specific filters
  idMal?: number;           // Filter by MyAnimeList ID
  idMalIn?: number[];       // Filter by multiple MAL IDs
  idMalNot?: number;        // Exclude specific MAL ID
  idMalNotIn?: number[];    // Exclude multiple MAL IDs

  // Type filter
  type?: "ANIME" | "MANGA"; // Media type

  // Format filters
  format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
  formatIn?: string[];      // Include multiple formats
  formatNot?: string;       // Exclude specific format
  formatNotIn?: string[];   // Exclude multiple formats

  // Status filters
  status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
  statusIn?: string[];      // Include multiple statuses
  statusNot?: string;       // Exclude specific status
  statusNotIn?: string[];   // Exclude multiple statuses

  // Season filters
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";

  // Source material filters
  sourceIn?: ("ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" |
              "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME")[];

  // Language in which anime available
  language?: "sub" | "dub" | "both" | "raw";

  // Content filters
  isAdult?: boolean;        // Filter adult content
  isLicensed?: boolean;     // Filter licensed content
  countryOfOrigin?: string; // Filter by country code
  nsfw?: boolean;           // Filter NSFW content
  ageRating?: ("G" | "PG" | "R" | "R18")[];  // Filter by age rating

  // Date filters
  startDateGreater?: string; // After this date (YYYY-MM-DD)
  startDateLesser?: string;  // Before this date (YYYY-MM-DD)
  startDateLike?: string;    // Similar to this date
  endDateGreater?: string;   // After this date (YYYY-MM-DD)
  endDateLesser?: string;    // Before this date (YYYY-MM-DD)
  endDateLike?: string;      // Similar to this date

  // Airing filters
  airingAtGreater?: number;  // After this timestamp (Unix timestamp)
  airingAtLesser?: number;   // Before this timestamp (Unix timestamp)

  // Number filters
  episodesGreater?: number; // More than this many episodes
  episodesLesser?: number;  // Less than this many episodes
  durationGreater?: number; // Longer than this (minutes)
  durationLesser?: number;  // Shorter than this (minutes)

  // Popularity/score filters
  popularityGreater?: number; // Higher popularity than this
  popularityLesser?: number;  // Lower popularity than this
  popularityNot?: number;     // Not this popularity value
  scoreGreater?: number;      // Higher score than this
  scoreLesser?: number;       // Lower score than this
  scoreNot?: number;          // Not this score value

  // People filters
  characterIn?: string[];     // Include anime with these characters
  voiceActorIn?: string[];    // Include anime with these voice actors
  studioIn?: string[];        // Include anime by these studios

  // Tag/genre filters
  genreIn?: string[];         // Include these genres
  genreNotIn?: string[];      // Exclude these genres
  tagIn?: string[];           // Include these tags
  tagNotIn?: string[];        // Exclude these tags
  tagCategoryIn?: string[];   // Include these tag categories
  tagCategoryNotIn?: string[]; // Exclude these tag categories

  // Sort options
  sort?: string[];           // Sort options
                             // Available options: id, id_desc, title_romaji, title_romaji_desc,
                             // title_english, title_english_desc, title_native, title_native_desc,
                             // type, type_desc, format, format_desc, start_date, start_date_desc,
                             // end_date, end_date_desc, score, score_desc, popularity, popularity_desc,
                             // trending, trending_desc, episodes, episodes_desc, duration, duration_desc,
                             // status, status_desc, updated_at, updated_at_desc
}
```
</details>

<details>
<summary><b>Get Episode List</b> - <code>GET /api/anime/info/:id/episodes</code></summary>

Get episode list for an anime.

**Example:**

```
GET https://api.example.com/api/anime/info/21/episodes
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Episode Details</b> - <code>GET /api/anime/info/:id/episodes/:number</code></summary>

Get details of a specific episode.

**Example:**

```
GET https://api.example.com/api/anime/info/21/episodes/1
```

**Parameters:**

- `id` (path): Anime ID (required)
- `number` (path): Episode number (required)
</details>

<details>
<summary><b>Get Episode Providers</b> - <code>GET /api/anime/info/:id/providers/:number</code></summary>

Get available streaming providers for a specific episode.

**Example:**

```
GET https://api.example.com/api/anime/info/21/providers/1
```

**Parameters:**

- `id` (path): Anime ID (required)
- `number` (path): Episode number (required)
</details>

<details>
<summary><b>Get Streaming Sources</b> - <code>GET /api/anime/watch/:id/episodes/:number</code></summary>

Get streaming sources for a specific episode.

**Example:**

```
GET https://api.example.com/api/anime/watch/21/episodes/1?provider=zoro&dub=false
```

**Parameters:**

- `id` (path): Anime ID (required)
- `number` (path): Episode number (required)
- `provider` (query): Provider name (default: "zoro")
- `dub` (query): Boolean for dubbed version (default: false)
</details>

<details>
<summary><b>Filter Anime</b> - <code>GET /api/anime/filter</code></summary>

Filter anime list based on various criteria.

**Example:**

```
GET https://api.example.com/api/anime/filter?format=TV&season=FALL&year=2023&genreIn=action,romance&sort=popularity_desc&page=1&perPage=20
```

**Parameters:**

```typescript
// FilterDto
{
  // Pagination
  page?: number;            // Page number for results
  perPage?: number;         // Number of results per page

  // Basic filters
  id?: number;              // Filter by Anilist ID
  idIn?: number[];          // Filter by multiple Anilist IDs
  idNot?: number;           // Exclude specific Anilist ID
  idNotIn?: number[];       // Exclude multiple Anilist IDs

  // Search and query
  query?: string;           // Text search query

  // MAL-specific filters
  idMal?: number;           // Filter by MyAnimeList ID
  idMalIn?: number[];       // Filter by multiple MAL IDs
  idMalNot?: number;        // Exclude specific MAL ID
  idMalNotIn?: number[];    // Exclude multiple MAL IDs

  // Type filter
  type?: "ANIME" | "MANGA"; // Media type

  // Format filters
  format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
  formatIn?: string[];      // Include multiple formats
  formatNot?: string;       // Exclude specific format
  formatNotIn?: string[];   // Exclude multiple formats

  // Status filters
  status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
  statusIn?: string[];      // Include multiple statuses
  statusNot?: string;       // Exclude specific status
  statusNotIn?: string[];   // Exclude multiple statuses

  // Season filters
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";

  // Source material filters
  sourceIn?: ("ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" |
              "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME")[];

  // Language in which anime available
  language?: "sub" | "dub" | "both" | "raw";

  // Content filters
  isAdult?: boolean;        // Filter adult content
  isLicensed?: boolean;     // Filter licensed content
  countryOfOrigin?: string; // Filter by country code
  nsfw?: boolean;           // Filter NSFW content
  ageRating?: ("G" | "PG" | "R" | "R18")[];  // Filter by age rating

  // Date filters
  startDateGreater?: string; // After this date (YYYY-MM-DD)
  startDateLesser?: string;  // Before this date (YYYY-MM-DD)
  startDateLike?: string;    // Similar to this date
  endDateGreater?: string;   // After this date (YYYY-MM-DD)
  endDateLesser?: string;    // Before this date (YYYY-MM-DD)
  endDateLike?: string;      // Similar to this date

  // Airing filters
  airingAtGreater?: number;  // After this timestamp (Unix timestamp)
  airingAtLesser?: number;   // Before this timestamp (Unix timestamp)

  // Number filters
  episodesGreater?: number; // More than this many episodes
  episodesLesser?: number;  // Less than this many episodes
  durationGreater?: number; // Longer than this (minutes)
  durationLesser?: number;  // Shorter than this (minutes)

  // Popularity/score filters
  popularityGreater?: number; // Higher popularity than this
  popularityLesser?: number;  // Lower popularity than this
  popularityNot?: number;     // Not this popularity value
  scoreGreater?: number;      // Higher score than this
  scoreLesser?: number;       // Lower score than this
  scoreNot?: number;          // Not this score value

  // People filters
  characterIn?: string[];     // Include anime with these characters
  voiceActorIn?: string[];    // Include anime with these voice actors
  studioIn?: string[];        // Include anime by these studios

  // Tag/genre filters
  genreIn?: string[];         // Include these genres
  genreNotIn?: string[];      // Exclude these genres
  tagIn?: string[];           // Include these tags
  tagNotIn?: string[];        // Exclude these tags
  tagCategoryIn?: string[];   // Include these tag categories
  tagCategoryNotIn?: string[]; // Exclude these tag categories

  // Sort options
  sort?: string[];           // Sort options
                             // Available options: id, id_desc, title_romaji, title_romaji_desc,
                             // title_english, title_english_desc, title_native, title_native_desc,
                             // type, type_desc, format, format_desc, start_date, start_date_desc,
                             // end_date, end_date_desc, score, score_desc, popularity, popularity_desc,
                             // trending, trending_desc, episodes, episodes_desc, duration, duration_desc,
                             // status, status_desc, updated_at, updated_at_desc
}
```
</details>

<details>
<summary><b>Search Anime</b> - <code>GET /api/anime/search/:q</code></summary>

Search for anime by query string.

**Example:**

```
GET https://api.example.com/api/anime/search/one%20piece
```

**Parameters:**

- `q` (path): Search query (required)
</details>

<details>
<summary><b>Get Random</b> - <code>GET /api/anime/random</code></summary>

Get random anime.

**Example:**

```
GET https://api.example.com/api/anime/random
```

**Parameters:** None

</details>

<details>
<summary><b>Get Anime Schedule</b> - <code>GET /api/anime/schedule</code></summary>

Get currently airing anime schedule.

**Example:**

```
GET https://api.example.com/api/anime/schedule
```

**Parameters:** None

</details>

<details>
<summary><b>Get Franchise Info</b> - <code>GET /api/anime/franchise/:franchise</code></summary>

Get information about an anime franchise.

**Example:**

```
GET https://api.example.com/api/anime/franchise/fate?page=1&perPage=20&sort=popularity_desc&format=TV
```

**Parameters:**

- `franchise` (path): Franchise name (required)
```typescript
// FilterDto
{
  // Pagination
  page?: number;            // Page number for results
  perPage?: number;         // Number of results per page

  // Basic filters
  id?: number;              // Filter by Anilist ID
  idIn?: number[];          // Filter by multiple Anilist IDs
  idNot?: number;           // Exclude specific Anilist ID
  idNotIn?: number[];       // Exclude multiple Anilist IDs

  // Search and query
  query?: string;           // Text search query

  // MAL-specific filters
  idMal?: number;           // Filter by MyAnimeList ID
  idMalIn?: number[];       // Filter by multiple MAL IDs
  idMalNot?: number;        // Exclude specific MAL ID
  idMalNotIn?: number[];    // Exclude multiple MAL IDs

  // Type filter
  type?: "ANIME" | "MANGA"; // Media type

  // Format filters
  format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
  formatIn?: string[];      // Include multiple formats
  formatNot?: string;       // Exclude specific format
  formatNotIn?: string[];   // Exclude multiple formats

  // Status filters
  status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
  statusIn?: string[];      // Include multiple statuses
  statusNot?: string;       // Exclude specific status
  statusNotIn?: string[];   // Exclude multiple statuses

  // Season filters
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";

  // Source material filters
  sourceIn?: ("ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" |
              "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME")[];

  // Language in which anime available
  language?: "sub" | "dub" | "both" | "raw";

  // Content filters
  isAdult?: boolean;        // Filter adult content
  isLicensed?: boolean;     // Filter licensed content
  countryOfOrigin?: string; // Filter by country code
  nsfw?: boolean;           // Filter NSFW content
  ageRating?: ("G" | "PG" | "R" | "R18")[];  // Filter by age rating

  // Date filters
  startDateGreater?: string; // After this date (YYYY-MM-DD)
  startDateLesser?: string;  // Before this date (YYYY-MM-DD)
  startDateLike?: string;    // Similar to this date
  endDateGreater?: string;   // After this date (YYYY-MM-DD)
  endDateLesser?: string;    // Before this date (YYYY-MM-DD)
  endDateLike?: string;      // Similar to this date

  // Airing filters
  airingAtGreater?: number;  // After this timestamp (Unix timestamp)
  airingAtLesser?: number;   // Before this timestamp (Unix timestamp)

  // Number filters
  episodesGreater?: number; // More than this many episodes
  episodesLesser?: number;  // Less than this many episodes
  durationGreater?: number; // Longer than this (minutes)
  durationLesser?: number;  // Shorter than this (minutes)

  // Popularity/score filters
  popularityGreater?: number; // Higher popularity than this
  popularityLesser?: number;  // Lower popularity than this
  popularityNot?: number;     // Not this popularity value
  scoreGreater?: number;      // Higher score than this
  scoreLesser?: number;       // Lower score than this
  scoreNot?: number;          // Not this score value

  // People filters
  characterIn?: string[];     // Include anime with these characters
  voiceActorIn?: string[];    // Include anime with these voice actors
  studioIn?: string[];        // Include anime by these studios

  // Tag/genre filters
  genreIn?: string[];         // Include these genres
  genreNotIn?: string[];      // Exclude these genres
  tagIn?: string[];           // Include these tags
  tagNotIn?: string[];        // Exclude these tags
  tagCategoryIn?: string[];   // Include these tag categories
  tagCategoryNotIn?: string[]; // Exclude these tag categories

  // Sort options
  sort?: string[];           // Sort options
                             // Available options: id, id_desc, title_romaji, title_romaji_desc,
                             // title_english, title_english_desc, title_native, title_native_desc,
                             // type, type_desc, format, format_desc, start_date, start_date_desc,
                             // end_date, end_date_desc, score, score_desc, popularity, popularity_desc,
                             // trending, trending_desc, episodes, episodes_desc, duration, duration_desc,
                             // status, status_desc, updated_at, updated_at_desc
}
```
</details>

<details>
<summary><b>Get All Genres</b> - <code>GET /api/anime/genres</code></summary>

Get a list of all available anime genres.

**Example:**

```
GET https://api.example.com/api/anime/genres
```

**Parameters:** None

</details>

<details>
<summary><b>Get All Tags</b> - <code>GET /api/anime/tags</code></summary>

Get a list of all available anime tags.

**Example:**

```
GET https://api.example.com/api/anime/tags?page=1&perPage=20
```

**Parameters:**

- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Get Last Updates</b> - <code>GET /api/anime/updates</code></summary>

Get the last updates for anime.

**Example:**

```
GET https://api.example.com/api/anime/updates?type=anilist&page=1&perPage=20
```

**Parameters:**

- `entityId` (query): Entity ID (optional)
- `externalId` (query): External ID (optional)
- `type` (query): Update type (default: "anilist")
- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Update Anime Info</b> - <code>PUT /api/anime/info/:id/update</code></summary>

Update anime information.

**Example:**

```
PUT https://api.example.com/api/anime/info/21/update
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Start Update</b> - <code>PUT /api/anime/update</code></summary>

Start the anime update process.

**Example:**

```
PUT https://api.example.com/api/anime/update
```

**Parameters:** None

</details>

<details>
<summary><b>Stop Update</b> - <code>PUT /api/anime/update/stop</code></summary>

Stop the anime update process.

**Example:**

```
PUT https://api.example.com/api/anime/update/stop
```

**Parameters:** None

</details>

<details>
<summary><b>Start Indexing</b> - <code>POST /api/anime/index</code></summary>

Start the anime indexing process.

**Example:**

```
POST https://api.example.com/api/anime/index?delay=10&range=25
```

**Parameters:**

- `delay` (query): Delay between requests in seconds (default: 10)
- `range` (query): Range of request delay (default: 25)
</details>

<details>
<summary><b>Stop Indexing</b> - <code>POST /api/anime/index/stop</code></summary>

Stop the anime indexing process.

**Example:**

```
POST https://api.example.com/api/anime/index/stop
```

**Parameters:** None

</details>
</details>

<details>
<summary><h3>🌸 Shikimori Endpoints</h3></summary>

<details>
<summary><b>Get Shikimori Info</b> - <code>GET /api/shikimori/info/:id</code></summary>

Get anime information from Shikimori.

**Example:**

```
GET https://api.example.com/api/shikimori/info/21
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Update Shikimori Info</b> - <code>PUT /api/shikimori/info/:id/update</code></summary>

Update anime information from Shikimori.

**Example:**

```
PUT https://api.example.com/api/shikimori/info/21/update
```

**Parameters:**

- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Shikimori Franchise</b> - <code>GET /api/shikimori/franchise/:franchise</code></summary>

Get franchise information from Shikimori.

**Example:**

```
GET https://api.example.com/api/shikimori/franchise/fate
```

**Parameters:**

- `franchise` (path): Franchise name (required)
</details>

<details>
<summary><b>Get Franchise IDs</b> - <code>GET /api/shikimori/franchiseId/:franchise</code></summary>

Get list of IDs in a franchise.

**Example:**

```
GET https://api.example.com/api/shikimori/franchiseId/fate
```

**Parameters:**

- `franchise` (path): Franchise name (required)
</details>
</details>

<details>
<summary><h3>📺 Streaming Sources Endpoints</h3></summary>

<details>
<summary><b>AnimePahe Anime Info</b> - <code>GET /api/anime/info/:id/animepahe</code></summary>

Get anime information from AnimePahe.

**Example:**

```
GET https://api.example.com/api/anime/info/21/animepahe
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>AnimePahe Streaming Sources</b> - <code>GET /api/anime/watch/:id/animepahe</code></summary>

Get streaming sources from AnimePahe.

**Example:**

```
GET https://api.example.com/api/anime/watch/ep_12345/animepahe
```

**Parameters:**

- `id` (path): AnimePahe episode ID (required)
</details>

<details>
<summary><b>AnimeKai Anime Info</b> - <code>GET /api/anime/info/:id/animekai</code></summary>

Get anime information from AnimeKai.

**Example:**

```
GET https://api.example.com/api/anime/info/21/animekai
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>AnimeKai Streaming Sources</b> - <code>GET /api/anime/watch/:id/animekai</code></summary>

Get streaming sources from AnimeKai.

**Example:**

```
GET https://api.example.com/api/anime/watch/ep_12345/animekai?dub=false
```

**Parameters:**

- `id` (path): AnimeKai episode ID (required)
- `dub` (query): Boolean for dubbed version (default: false)
</details>

<details>
<summary><b>Zoro Anime Info</b> - <code>GET /api/anime/info/:id/zoro</code></summary>

Get anime information from Zoro.

**Example:**

```
GET https://api.example.com/api/anime/info/21/zoro
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Zoro Streaming Sources</b> - <code>GET /api/anime/watch/:id/zoro</code></summary>

Get streaming sources from Zoro.

**Example:**

```
GET https://api.example.com/api/anime/watch/ep_12345/zoro?dub=false
```

**Parameters:**

- `id` (path): Zoro episode ID (required)
- `dub` (query): Boolean for dubbed version (default: false)
</details>
</details>

<details>
<summary><h3>🎬 TMDB Endpoints</h3></summary>

<details>
<summary><b>Get TMDB Info</b> - <code>GET /api/anime/info/:id/tmdb</code></summary>

Get TMDB information using Anilist ID.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tmdb
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Get TMDB Season Info</b> - <code>GET /api/anime/info/:id/tmdb/season</code></summary>

Get TMDB season information for an anime.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tmdb/season
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Get TMDB Season Episode</b> - <code>GET /api/anime/info/:id/tmdb/season/:ep</code></summary>

Get TMDB episode information for a specific episode.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tmdb/season/1
```

**Parameters:**

- `id` (path): Anilist ID (required)
- `ep` (path): Episode number (required)
</details>

<details>
<summary><b>Update TMDB Info</b> - <code>GET /api/anime/info/:id/tmdb/update</code></summary>

Update TMDB information for an anime.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tmdb/update
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>
</details>

<details>
<summary><h3>🎨 Kitsu Endpoints</h3></summary>

<details>
<summary><b>Get Kitsu Info</b> - <code>GET /api/anime/info/:id/kitsu</code></summary>

Get Kitsu information using Anilist ID.

**Example:**

```
GET https://api.example.com/api/anime/info/21/kitsu
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Update Kitsu Info</b> - <code>PUT /api/anime/info/:id/kitsu/update</code></summary>

Update Kitsu information for an anime.

**Example:**

```
PUT https://api.example.com/api/anime/info/21/kitsu/update
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>
</details>

<details>
<summary><h3>📺 TVDB Endpoints</h3></summary>

<details>
<summary><b>Get TVDB Info</b> - <code>GET /api/anime/info/:id/tvdb</code></summary>

Get TVDB information using Anilist ID.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tvdb
```

**Parameters:**

- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Get TVDB Translations</b> - <code>GET /api/anime/info/:id/tvdb/translations/:language</code></summary>

Get TVDB translations for a specific language.

**Example:**

```
GET https://api.example.com/api/anime/info/21/tvdb/translations/en
```

**Parameters:**

- `id` (path): Anilist ID (required)
- `language` (path): Language code (required)
</details>

<details>
<summary><b>Get TVDB Languages</b> - <code>GET /api/anime/tvdb/languages</code></summary>

Get list of available languages in TVDB.

**Example:**

```
GET https://api.example.com/api/anime/tvdb/languages
```

**Parameters:** None

</details>

<details>
<summary><b>Update TVDB Languages</b> - <code>PUT /api/anime/tvdb/languages</code></summary>

Update the list of available TVDB languages.

**Example:**

```
PUT https://api.example.com/api/anime/tvdb/languages
```

**Parameters:** None

</details>
</details>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [Prisma](https://www.prisma.io/) - ORM
- [Consumet API](https://github.com/consumet/consumet.ts) - For anime scraping inspiration and utilities
- Various anime API providers for their data
- Arigato [Shimizudev](https://github.com/shimizudev) for providing me code

## 📄 License

This project is [MIT licensed](LICENSE).

---

> **Note**: This documentation might be outdated as I'm too lazy to keep it up to date. For the most accurate and up-to-date information, please check the source code directly. The code is the source of truth!
