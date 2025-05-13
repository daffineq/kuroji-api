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
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Acknowledgments](#-acknowledgments)
- [License](#-license)

---

## 🔍 Overview

Kuroji API is built on NestJS and TypeScript, providing a robust and scalable solution for anime-related applications. The API allows you to access anime information, streaming sources, and more from various providers in a unified interface.

> **Public API Instance**: A public instance is available at https://138.68.111.93
> 
> ⚠️ **Rate Limit**: 4 requests per minute
> 
> ⚠️ **Warning**: This public instance is not recommended for use in production applications.

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
$ yarn install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your API keys and database settings

# Run database migrations
$ npx prisma migrate dev

# Start the server
$ yarn start:dev
```

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
$ docker-compose up -d
```

The API will be available at: http://localhost:3000

> **Note**: This requires Docker to be installed and running on your system. The above command will start the Kuroji API server along with PostgreSQL and Redis with the configuration specified in the docker-compose.yml file.

### 💻 Development Setup

For a quicker development workflow, you can run just the PostgreSQL and Redis services using the basic Docker Compose file:

```bash
# Start only PostgreSQL and Redis
$ docker-compose -f docker-compose.basic.yml up -d
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
GET https://138.68.111.93/api/anime/info/21
```

**Parameters:**
- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Anime Recommendations</b> - <code>GET /api/anime/info/:id/recommendations</code></summary>

Get anime recommendations based on an anime ID.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/recommendations?page=1&perPage=10
```

**Parameters:**
- `id` (path): Anime ID (required)
- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Get Anime Characters</b> - <code>GET /api/anime/info/:id/characters</code></summary>

Get characters from an anime.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/characters?page=1&perPage=20
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
GET https://138.68.111.93/api/anime/info/21/chronology?page=1&perPage=10
```

**Parameters:**
- `id` (path): Anime ID (required)
- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Get Episode List</b> - <code>GET /api/anime/info/:id/episodes</code></summary>

Get episode list for an anime.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/episodes
```

**Parameters:**
- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Episode Details</b> - <code>GET /api/anime/info/:id/episodes/:number</code></summary>

Get details of a specific episode.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/episodes/1
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
GET https://138.68.111.93/api/anime/info/21/providers/1
```

**Parameters:**
- `id` (path): Anime ID (required)
- `number` (path): Episode number (required)
</details>

<details>
<summary><b>Get All Providers</b> - <code>GET /api/anime/info/:id/providers</code></summary>

Get all available streaming providers for all episodes of an anime.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/providers
```

**Parameters:**
- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Streaming Sources</b> - <code>GET /api/anime/watch/:id/episodes/:number</code></summary>

Get streaming sources for a specific episode.

**Example:**
```
GET https://138.68.111.93/api/anime/watch/21/episodes/1?provider=ANIWATCH&dub=false
```

**Parameters:**
- `id` (path): Anime ID (required)
- `number` (path): Episode number (required)
- `provider` (query): Provider name (default: "ANIWATCH")
- `dub` (query): Boolean for dubbed version (default: false)
</details>

<details>
<summary><b>Filter Anime</b> - <code>GET /api/anime/filter</code></summary>

Filter anime list based on various criteria.

**Example:**
```
GET https://138.68.111.93/api/anime/filter?format=TV&season=FALL&year=2023&genreIn=action,romance&sort=popularity_desc&page=1&perPage=20
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
  
  // Content filters
  isAdult?: boolean;        // Filter adult content
  isLicensed?: boolean;     // Filter licensed content
  countryOfOrigin?: string; // Filter by country code
  
  // Date filters
  startDateGreater?: string; // After this date (YYYY-MM-DD)
  startDateLesser?: string;  // Before this date (YYYY-MM-DD)
  startDateLike?: string;    // Similar to this date
  endDateGreater?: string;   // After this date (YYYY-MM-DD)
  endDateLesser?: string;    // Before this date (YYYY-MM-DD)
  endDateLike?: string;      // Similar to this date
  
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
  tagsIn?: string[];          // Include these tags (alternative)
  tagsNotIn?: string[];       // Exclude these tags (alternative)
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
GET https://138.68.111.93/api/anime/search/one%20piece
```

**Parameters:**
- `q` (path): Search query (required)
</details>

<details>
<summary><b>Get Anime Schedule</b> - <code>GET /api/anime/schedule</code></summary>

Get currently airing anime schedule.

**Example:**
```
GET https://138.68.111.93/api/anime/schedule
```

**Parameters:** None
</details>

<details>
<summary><b>Get Franchise Info</b> - <code>GET /api/anime/franchise/:franchise</code></summary>

Get information about an anime franchise.

**Example:**
```
GET https://138.68.111.93/api/anime/franchise/fate?page=1&perPage=20
```

**Parameters:**
- `franchise` (path): Franchise name (required)
- `page` (query): Page number (default: 1)
- `perPage` (query): Results per page (default: 20)
</details>

<details>
<summary><b>Start Indexing</b> - <code>PUT /api/anime/index</code></summary>

Start the anime indexing process.

**Example:**
```
PUT https://138.68.111.93/api/anime/index?delay=10
```

**Parameters:**
- `delay` (query): Delay between requests in seconds (default: 10)
</details>

<details>
<summary><b>Stop Indexing</b> - <code>PUT /api/anime/index/stop</code></summary>

Stop the anime indexing process.

**Example:**
```
PUT https://138.68.111.93/api/anime/index/stop
```

**Parameters:** None
</details>

<details>
<summary><b>Schedule Indexing</b> - <code>PUT /api/anime/index/schedule</code></summary>

Schedule periodic indexing.

**Example:**
```
PUT https://138.68.111.93/api/anime/index/schedule
```

**Parameters:** None
</details>

<details>
<summary><b>Unschedule Indexing</b> - <code>PUT /api/anime/index/unschedule</code></summary>

Cancel scheduled indexing.

**Example:**
```
PUT https://138.68.111.93/api/anime/index/unschedule
```

**Parameters:** None
</details>
</details>

<details>
<summary><h3>🌸 Shikimori Endpoints</h3></summary>

<details>
<summary><b>Get Shikimori Anime Info</b> - <code>GET /api/shikimori/info/:id</code></summary>

Get anime information from Shikimori.

**Example:**
```
GET https://138.68.111.93/api/shikimori/info/21
```

**Parameters:**
- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Update Shikimori Anime Info</b> - <code>PUT /api/shikimori/info/:id</code></summary>

Update anime information from Shikimori.

**Example:**
```
PUT https://138.68.111.93/api/shikimori/info/21
```

**Parameters:**
- `id` (path): Anime ID (required)
</details>

<details>
<summary><b>Get Shikimori Franchise</b> - <code>GET /api/shikimori/franchise/:franchise</code></summary>

Get franchise information from Shikimori.

**Example:**
```
GET https://138.68.111.93/api/shikimori/franchise/fate
```

**Parameters:**
- `franchise` (path): Franchise name (required)
</details>

<details>
<summary><b>Get Franchise IDs</b> - <code>GET /api/shikimori/franchiseId/:franchise</code></summary>

Get list of IDs in a franchise.

**Example:**
```
GET https://138.68.111.93/api/shikimori/franchiseId/fate
```

**Parameters:**
- `franchise` (path): Franchise name (required)
</details>
</details>

<details>
<summary><h3>📺 Streaming Sources Endpoints</h3></summary>

> **Note**: The streaming providers share common endpoint patterns. Use the correct provider ID when making requests.

<details>
<summary><b>AnimePahe Anime Info</b> - <code>GET /api/anime/info/:id/animepahe</code></summary>

Get anime information from AnimePahe.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/animepahe
```

**Parameters:**
- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>AnimePahe Streaming Sources</b> - <code>GET /api/anime/watch/:id</code></summary>

Get streaming sources from AnimePahe.

**Example:**
```
GET https://138.68.111.93/api/anime/watch/ep_12345
```

**Parameters:**
- `id` (path): AnimePahe episode ID (required)
</details>

<details>
<summary><b>AnimeKai Anime Info</b> - <code>GET /api/anime/info/:id/animekai</code></summary>

Get anime information from AnimeKai.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/animekai
```

**Parameters:**
- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>AnimeKai Streaming Sources</b> - <code>GET /api/anime/watch/:id</code></summary>

Get streaming sources from AnimeKai.

**Example:**
```
GET https://138.68.111.93/api/anime/watch/ep_12345?dub=false
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
GET https://138.68.111.93/api/anime/info/21/zoro
```

**Parameters:**
- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Zoro Streaming Sources</b> - <code>GET /api/anime/watch/:id</code></summary>

Get streaming sources from Zoro.

**Example:**
```
GET https://138.68.111.93/api/anime/watch/ep_12345?dub=false
```

**Parameters:**
- `id` (path): Zoro episode ID (required)
- `dub` (query): Boolean for dubbed version (default: false)
</details>
</details>

<details>
<summary><h3>⚠️ Exceptions Endpoints</h3></summary>

<details>
<summary><b>Get All Exceptions</b> - <code>GET /api/exceptions</code></summary>

Get all logged exceptions.

**Example:**
```
GET https://138.68.111.93/api/exceptions?page=1&perPage=20&statusCode=500
```

**Parameters:**
```typescript
// ExceptionFilterDto
{
  // Filter by exception details
  statusCode?: number;     // HTTP status code
  path?: string;           // Request path
  message?: string;        // Error message
  method?: string;         // HTTP method (GET, POST, etc.)
  
  // Filter by date range
  fromDate?: string;       // Start date (ISO format)
  toDate?: string;         // End date (ISO format)
  
  // Pagination
  page?: number;           // Page number (min: 1)
  perPage?: number;        // Results per page (min: 1)
}
```
</details>

<details>
<summary><b>Delete Exception</b> - <code>DELETE /api/exceptions/delete/:id</code></summary>

Delete a logged exception.

**Example:**
```
DELETE https://138.68.111.93/api/exceptions/delete/1
```

**Parameters:**
- `id` (path): Exception ID (required)
</details>
</details>

<details>
<summary><h3>📋 Console Endpoints</h3></summary>

<details>
<summary><b>Get Console Logs</b> - <code>GET /api/console/logs</code></summary>

Get all console logs.

**Example:**
```
GET https://138.68.111.93/api/console/logs
```

**Parameters:** None
</details>

<details>
<summary><b>Get Console Warnings</b> - <code>GET /api/console/warns</code></summary>

Get all console warnings.

**Example:**
```
GET https://138.68.111.93/api/console/warns
```

**Parameters:** None
</details>

<details>
<summary><b>Get Console Errors</b> - <code>GET /api/console/errors</code></summary>

Get all console errors.

**Example:**
```
GET https://138.68.111.93/api/console/errors
```

**Parameters:** None
</details>
</details>

<details>
<summary><h3>🎬 TMDB Endpoints</h3></summary>

<details>
<summary><b>Get TMDB Info</b> - <code>GET /api/anime/info/:id/tmdb</code></summary>

Get TMDB information using Anilist ID.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/tmdb
```

**Parameters:**
- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Get TMDB Season Info</b> - <code>GET /api/anime/info/:id/tmdb/season</code></summary>

Get TMDB season information for an anime.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/tmdb/season
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
GET https://138.68.111.93/api/anime/info/21/tvdb
```

**Parameters:**
- `id` (path): Anilist ID (required)
</details>

<details>
<summary><b>Get TVDB Translations</b> - <code>GET /api/anime/info/:id/tvdb/translations/:language</code></summary>

Get TVDB translations for a specific language.

**Example:**
```
GET https://138.68.111.93/api/anime/info/21/tvdb/translations/en
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
GET https://138.68.111.93/api/anime/tvdb/languages
```

**Parameters:** None
</details>

<details>
<summary><b>Update TVDB Languages</b> - <code>PUT /api/anime/tvdb/languages</code></summary>

Update the list of available TVDB languages.

**Example:**
```
PUT https://138.68.111.93/api/anime/tvdb/languages
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

## 📄 License

This project is [MIT licensed](LICENSE).
