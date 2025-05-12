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

### Endpoints Overview
- [Anime](#anime-endpoints)
- [Shikimori](#shikimori-endpoints)
- [Streaming Sources](#streaming-sources-endpoints)
- [Exceptions](#exceptions-endpoints)
- [Console](#console-endpoints)
- [TMDB](#tmdb-endpoints)
- [TVDB](#tvdb-endpoints)

### Anime Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id` | `GET` | Get detailed anime information | `id`: Anime ID |
| `/api/anime/info/:id/recommendations` | `GET` | Get recommendations based on anime | `id`: Anime ID<br>`page`: Page number (default: 1)<br>`perPage`: Results per page (default: 20) |
| `/api/anime/info/:id/characters` | `GET` | Get characters from an anime | `id`: Anime ID<br>`page`: Page number (default: 1)<br>`perPage`: Results per page (default: 20) |
| `/api/anime/info/:id/chronology` | `GET` | Get chronological order of related anime | `id`: Anime ID<br>`page`: Page number (default: 1)<br>`perPage`: Results per page (default: 20) |
| `/api/anime/info/:id/episodes` | `GET` | Get episode list for an anime | `id`: Anime ID |
| `/api/anime/info/:id/episodes/:number` | `GET` | Get details of a specific episode | `id`: Anime ID<br>`number`: Episode number |
| `/api/anime/info/:id/providers/:number` | `GET` | Get available streaming providers for an episode | `id`: Anime ID<br>`number`: Episode number |
| `/api/anime/info/:id/providers` | `GET` | Get all streaming providers for all episodes | `id`: Anime ID |
| `/api/anime/watch/:id/episodes/:number` | `GET` | Get streaming sources for a specific episode | `id`: Anime ID<br>`number`: Episode number<br>`provider`: Provider name (default: "ANIWATCH")<br>`dub`: Boolean (default: false) |
| `/api/anime/filter` | `GET` | Filter anime list by various criteria | See [Filter Parameters](#filter-parameters) |
| `/api/anime/search/:q` | `GET` | Search anime by query string | `q`: Search query |
| `/api/anime/schedule` | `GET` | Get currently airing anime schedule | - |
| `/api/anime/franchise/:franchise` | `GET` | Get information about an anime franchise | `franchise`: Franchise name<br>`page`: Page number (default: 1)<br>`perPage`: Results per page (default: 20) |
| `/api/anime/index` | `PUT` | Start the anime indexing process | `delay`: Delay between requests (default: 10) |
| `/api/anime/index/stop` | `PUT` | Stop the anime indexing process | - |
| `/api/anime/index/sleep/:sleep` | `PUT` | Set sleep time between indexing operations | `sleep`: Sleep time in seconds |
| `/api/anime/index/schedule` | `PUT` | Schedule periodic indexing | - |
| `/api/anime/index/unschedule` | `PUT` | Cancel scheduled indexing | - |

<details>
<summary><b>Filter Parameters</b></summary>

```typescript
// FilterDto
{
  // Pagination
  page?: number;            // Page number for results
  perPage?: number;         // Number of results per page
  
  // Search and query
  query?: string;           // Text search query
  
  // Basic filters
  id?: number;              // Filter by Anilist ID
  idIn?: number[];          // Filter by multiple Anilist IDs
  idNot?: number;           // Exclude specific Anilist ID
  idNotIn?: number[];       // Exclude multiple Anilist IDs
  
  // MAL-specific filters
  idMal?: number;           // Filter by MyAnimeList ID
  idMalIn?: number[];       // Filter by multiple MAL IDs
  idMalNot?: number;        // Exclude specific MAL ID
  idMalNotIn?: number[];    // Exclude multiple MAL IDs
  
  // Format filters
  format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
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
  endDateGreater?: string;   // After this date
  endDateLesser?: string;    // Before this date
  endDateLike?: string;      // Similar to this date
  
  // Number filters
  episodesGreater?: number; // More than this many episodes
  episodesLesser?: number;  // Less than this many episodes
  durationGreater?: number; // Longer than this (minutes)
  durationLesser?: number;  // Shorter than this (minutes)
  
  // Popularity/score filters
  popularityGreater?: number;
  popularityLesser?: number;
  popularityNot?: number;
  scoreGreater?: number;
  scoreLesser?: number;
  scoreNot?: number;
  
  // Tag/genre filters
  genreIn?: string[];       // Include these genres
  genreNotIn?: string[];    // Exclude these genres
  tagIn?: string[];         // Include these tags
  tagNotIn?: string[];      // Exclude these tags
  tagCategoryIn?: string[]; // Include these tag categories
  tagCategoryNotIn?: string[]; // Exclude these tag categories
  
  // License filters
  licensedByIn?: string[];  // Include these licensors
  licensedByIdIn?: string[]; // Include these licensor IDs
  
  // Additional filters
  sort?: string[];          // Sort options
}
```
</details>

### Shikimori Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/shikimori/info/:id` | `GET` | Get anime information from Shikimori | `id`: Anime ID |
| `/api/shikimori/info/:id` | `PUT` | Update anime information from Shikimori | `id`: Anime ID |
| `/api/shikimori/franchise/:franchise` | `GET` | Get franchise information from Shikimori | `franchise`: Franchise name |
| `/api/shikimori/franchiseId/:franchise` | `GET` | Get list of IDs in a franchise | `franchise`: Franchise name |

### Streaming Sources Endpoints

> **Note**: The streaming providers share common endpoint patterns. Use the correct provider ID when making requests.

#### AnimePahe

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id/animepahe` | `GET` | Get anime information from AnimePahe | `id`: Anilist ID |
| `/api/anime/watch/:id` | `GET` | Get streaming sources from AnimePahe | `id`: AnimePahe ID |

#### AnimeKai

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id/animekai` | `GET` | Get anime information from AnimeKai | `id`: Anilist ID |
| `/api/anime/watch/:id` | `GET` | Get streaming sources from AnimeKai | `id`: AnimeKai ID<br>`dub`: Boolean (default: false) |

#### Zoro

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id/zoro` | `GET` | Get anime information from Zoro | `id`: Anilist ID |
| `/api/anime/watch/:id` | `GET` | Get streaming sources from Zoro | `id`: Zoro ID<br>`dub`: Boolean (default: false) |

### Exceptions Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/exceptions` | `GET` | Get all logged exceptions | See [Exception Parameters](#exception-parameters) |
| `/api/exceptions/delete/:id` | `DELETE` | Delete a logged exception | `id`: Exception ID |

<details>
<summary><b>Exception Parameters</b></summary>

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

### Console Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/console/logs` | `GET` | Get all console logs | - |
| `/api/console/warns` | `GET` | Get all console warnings | - |
| `/api/console/errors` | `GET` | Get all console errors | - |

### TMDB Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id/tmdb` | `GET` | Get TMDB information using Anilist ID | `id`: Anilist ID |
| `/api/anime/info/:id/tmdb/season` | `GET` | Get TMDB season information for an anime | `id`: Anilist ID |

### TVDB Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/anime/info/:id/tvdb` | `GET` | Get TVDB information using Anilist ID | `id`: Anilist ID |
| `/api/anime/info/:id/tvdb/translations/:language` | `GET` | Get TVDB translations for a specific language | `id`: Anilist ID<br>`language`: Language code |
| `/api/anime/tvdb/languages` | `GET` | Get list of available languages in TVDB | - |
| `/api/anime/tvdb/languages` | `PUT` | Update the list of available TVDB languages | - |

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
