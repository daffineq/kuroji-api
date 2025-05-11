<p align="center">
  <a href="https://github.com/veaquer/kuroji-api">
    <img src="https://raw.githubusercontent.com/veaquer/kuroji-api/main/public/img/logo.svg" alt="Logo" width="100%" style="max-height: 300px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
  </a>
</p>

# <p align="center">Kuroji API - Anime API</p>

<p align="center">
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/Built%20with-NestJS-ea2845" alt="Built with NestJS"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

Kuroji API is a powerful and flexible API for accessing anime information, streaming sources, and related content from various providers. Built on NestJS and TypeScript, it provides a robust and scalable solution for anime-related applications.

## Features

- 🔍 Search and retrieve detailed anime information
- 🎬 Access multiple streaming sources (AnimePahe, AnimeKai, Zoro)
- 📅 Get airing schedules and updates
- 🧐 Detailed exception handling and logging

## Installation

```bash
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

## Getting Started

> **Important**: This API requires PostgreSQL and Redis to be running. Make sure both services are properly configured in your `.env` file.

### Quick Start

You can quickly start both PostgreSQL and Redis using Docker:

```bash
# Start PostgreSQL and Redis in detached mode
$ sudo docker-compose up -d
```

> **Note**: This requires Docker to be installed and running on your system. The above command will start PostgreSQL and Redis with the configuration specified in the docker-compose.yml file.

### Database Indexing

Before you can retrieve anime data, you must first populate the database using one of these methods:

1. **Automatic Indexing**: Trigger the database indexing process with:
   ```
   PUT /anime/index
   ```
   This will start populating your database with anime information.

2. **Manual Addition**: Add specific anime to your database by fetching their details:
   ```
   GET /anime/info/:id
   ```

The API will only return information for anime that have been indexed in your database. If you're setting up the API for the first time, make sure to run the indexing process after installation.

## API Documentation

### Table of Contents
- [Anime](#anime)
- [Shikimori](#shikimori)
- [Streaming Sources](#streaming-sources)
- [Exceptions](#exceptions)
- [Console](#console)
- [TMDB](#tmdb)
- [TVDB](#tvdb)

## Anime

<details>
<summary><h3>Get Anime Details</h3></summary>

**URL**: `/anime/info/:id`  
**Method**: `GET`  
**Description**: Get detailed information about an anime by ID

**Example**: `https://api.example.com/api/anime/info/1`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get Anime Recommendations</h3></summary>

**URL**: `/anime/info/:id/recommendations`  
**Method**: `GET`  
**Description**: Get anime recommendations based on an anime ID

**Example**: `https://api.example.com/api/anime/info/1/recommendations?page=1&perPage=10`

**Path Parameters**:
```
id: number
```

**Query Parameters**:
```
perPage?: number (default: 20)
page?: number (default: 1)
```
</details>

<details>
<summary><h3>Get Anime Characters</h3></summary>

**URL**: `/anime/info/:id/characters`  
**Method**: `GET`  
**Description**: Get characters from an anime

**Example**: `https://api.example.com/api/anime/info/1/characters?page=1&perPage=20`

**Path Parameters**:
```
id: number
```

**Query Parameters**:
```
perPage?: number (default: 20)
page?: number (default: 1)
```
</details>

<details>
<summary><h3>Get Anime Chronology</h3></summary>

**URL**: `/anime/info/:id/chronology`  
**Method**: `GET`  
**Description**: Get chronological order of related anime

**Example**: `https://api.example.com/api/anime/info/1/chronology?page=1&perPage=10`

**Path Parameters**:
```
id: number
```

**Query Parameters**:
```
perPage?: number (default: 20)
page?: number (default: 1)
```
</details>

<details>
<summary><h3>Get Anime Episodes</h3></summary>

**URL**: `/anime/info/:id/episodes`  
**Method**: `GET`  
**Description**: Get episode list for an anime

**Example**: `https://api.example.com/api/anime/info/1/episodes`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get Specific Episode</h3></summary>

**URL**: `/anime/info/:id/episodes/:number`  
**Method**: `GET`  
**Description**: Get details of a specific episode

**Example**: `https://api.example.com/api/anime/info/1/episodes/5`

**Path Parameters**:
```
id: number
number: number
```
</details>

<details>
<summary><h3>Get Episode Providers</h3></summary>

**URL**: `/anime/info/:id/providers/:number`  
**Method**: `GET`  
**Description**: Get available streaming providers for a specific episode

**Example**: `https://api.example.com/api/anime/info/1/providers/5`

**Path Parameters**:
```
id: number
number: number
```
</details>

<details>
<summary><h3>Get All Providers for Anime</h3></summary>

**URL**: `/anime/info/:id/providers`  
**Method**: `GET`  
**Description**: Get all available streaming providers for all episodes of an anime

**Example**: `https://api.example.com/api/anime/info/1/providers`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get Streaming Sources</h3></summary>

**URL**: `/anime/watch/:id/episodes/:number`  
**Method**: `GET`  
**Description**: Get streaming sources for a specific episode

**Example**: `https://api.example.com/api/anime/watch/1/episodes/5?provider=ANIWATCH&dub=false`

**Path Parameters**:
```
id: number
number: number
```

**Query Parameters**:
```
provider?: string (default: "ANIWATCH")
dub?: boolean (default: false)
```
</details>

<details>
<summary><h3>Filter Anime List</h3></summary>

**URL**: `/anime/filter`  
**Method**: `GET`  
**Description**: Filter anime list based on various criteria

**Example**: `https://api.example.com/api/anime/filter?page=1&perPage=20&genre=action,romance&season=FALL&year=2023`

**Query Parameters**:
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

<details>
<summary><h3>Search Anime</h3></summary>

**URL**: `/anime/search/:q`  
**Method**: `GET`  
**Description**: Search for anime by query string

**Example**: `https://api.example.com/api/anime/search/attack%20on%20titan`

**Path Parameters**:
```
q: string
```
</details>

<details>
<summary><h3>Get Anime Schedule</h3></summary>

**URL**: `/anime/schedule`  
**Method**: `GET`  
**Description**: Get currently airing anime schedule

**Example**: `https://api.example.com/api/anime/schedule`
</details>

<details>
<summary><h3>Get Franchise Info</h3></summary>

**URL**: `/anime/franchise/:franchise`  
**Method**: `GET`  
**Description**: Get information about an anime franchise

**Example**: `https://api.example.com/api/anime/franchise/fate?page=1&perPage=20`

**Path Parameters**:
```
franchise: string
```

**Query Parameters**:
```
perPage?: number (default: 20)
page?: number (default: 1)
```
</details>

<details>
<summary><h3>Start Indexing</h3></summary>

**URL**: `/anime/index`  
**Method**: `PUT`  
**Description**: Start the anime indexing process

**Example**: `https://api.example.com/api/anime/index?delay=10`

**Query Parameters**:
```
delay?: number (default: 10)
```
</details>

<details>
<summary><h3>Stop Indexing</h3></summary>

**URL**: `/anime/index/stop`  
**Method**: `PUT`  
**Description**: Stop the anime indexing process

**Example**: `https://api.example.com/api/anime/index/stop`
</details>

<details>
<summary><h3>Set Indexer Sleep Time</h3></summary>

**URL**: `/anime/index/sleep/:sleep`  
**Method**: `PUT`  
**Description**: Set the sleep time between indexing operations

**Example**: `https://api.example.com/api/anime/index/sleep/60`

**Path Parameters**:
```
sleep: number
```
</details>

<details>
<summary><h3>Schedule Indexing</h3></summary>

**URL**: `/anime/index/schedule`  
**Method**: `PUT`  
**Description**: Schedule periodic indexing

**Example**: `https://api.example.com/api/anime/index/schedule`
</details>

<details>
<summary><h3>Unschedule Indexing</h3></summary>

**URL**: `/anime/index/unschedule`  
**Method**: `PUT`  
**Description**: Cancel scheduled indexing

**Example**: `https://api.example.com/api/anime/index/unschedule`
</details>

## Shikimori

<details>
<summary><h3>Get Shikimori Anime Info</h3></summary>

**URL**: `/shikimori/info/:id`  
**Method**: `GET`  
**Description**: Get anime information from Shikimori

**Example**: `https://api.example.com/api/shikimori/info/1`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Update Shikimori Anime Info</h3></summary>

**URL**: `/shikimori/info/:id`  
**Method**: `PUT`  
**Description**: Update anime information from Shikimori

**Example**: `https://api.example.com/shikimori/info/1`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get Shikimori Franchise</h3></summary>

**URL**: `/shikimori/franchise/:franchise`  
**Method**: `GET`  
**Description**: Get franchise information from Shikimori

**Example**: `https://api.example.com/shikimori/franchise/fate`

**Path Parameters**:
```
franchise: string
```
</details>

<details>
<summary><h3>Get Franchise IDs</h3></summary>

**URL**: `/shikimori/franchiseId/:franchise`  
**Method**: `GET`  
**Description**: Get list of IDs in a franchise

**Example**: `https://api.example.com/shikimori/franchiseId/fate`

**Path Parameters**:
```
franchise: string
```
</details>

## Streaming Sources

> **Note**: The streaming providers share common endpoint patterns. Make sure to use the correct provider ID when making requests.

#### AnimePahe

<details>
<summary><h3>Get AnimePahe Anime Info</h3></summary>

**URL**: `/anime/info/:id/animepahe`  
**Method**: `GET`  
**Description**: Get anime information from AnimePahe

**Example**: `https://api.example.com/anime/info/1/animepahe`

**Path Parameters**:
```
id: number (Anilist ID)
```
</details>

<details>
<summary><h3>Get AnimePahe Streaming Sources</h3></summary>

**URL**: `/anime/watch/:id`  
**Method**: `GET`  
**Description**: Get streaming sources from AnimePahe

**Example**: `https://api.example.com/anime/watch/ep_12345`

**Path Parameters**:
```
id: string (AnimePahe ID)
```
</details>

#### AnimeKai

<details>
<summary><h3>Get AnimeKai Anime Info</h3></summary>

**URL**: `/anime/info/:id/animekai`  
**Method**: `GET`  
**Description**: Get anime information from AnimeKai

**Example**: `https://api.example.com/anime/info/1/animekai`

**Path Parameters**:
```
id: number (Anilist ID)
```
</details>

<details>
<summary><h3>Get AnimeKai Streaming Sources</h3></summary>

**URL**: `/anime/watch/:id`  
**Method**: `GET`  
**Description**: Get streaming sources from AnimeKai

**Example**: `https://api.example.com/anime/watch/ep_12345?dub=false`

**Path Parameters**:
```
id: string (AnimeKai ID)
```

**Query Parameters**:
```
dub?: boolean (default: false)
```
</details>

#### Zoro

<details>
<summary><h3>Get Zoro Anime Info</h3></summary>

**URL**: `/anime/info/:id/zoro`  
**Method**: `GET`  
**Description**: Get anime information from Zoro using Anilist ID

**Example**: `https://api.example.com/anime/info/1/zoro`

**Path Parameters**:
```
id: number (Anilist ID)
```
</details>

<details>
<summary><h3>Get Zoro Streaming Sources</h3></summary>

**URL**: `/anime/watch/:id`  
**Method**: `GET`  
**Description**: Get streaming sources from Zoro

**Example**: `https://api.example.com/anime/watch/ep_12345?dub=false`

**Path Parameters**:
```
id: string (Zoro ID)
```

**Query Parameters**:
```
dub?: boolean (default: false)
```
</details>

## Exceptions

<details>
<summary><h3>Get All Exceptions</h3></summary>

**URL**: `/exceptions`  
**Method**: `GET`  
**Description**: Get all logged exceptions

**Example**: `https://api.example.com/exceptions?page=1&perPage=20&statusCode=500`

**Query Parameters**:
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
<summary><h3>Delete Exception</h3></summary>

**URL**: `/exceptions/delete/:id`  
**Method**: `DELETE`  
**Description**: Delete a logged exception

**Example**: `https://api.example.com/exceptions/delete/1`

**Path Parameters**:
```
id: number
```
</details>

## Console

<details>
<summary><h3>Get Console Logs</h3></summary>

**URL**: `/console/logs`  
**Method**: `GET`  
**Description**: Get all console logs

**Example**: `https://api.example.com/console/logs`
</details>

<details>
<summary><h3>Get Console Warnings</h3></summary>

**URL**: `/console/warns`  
**Method**: `GET`  
**Description**: Get all console warnings

**Example**: `https://api.example.com/console/warns`
</details>

<details>
<summary><h3>Get Console Errors</h3></summary>

**URL**: `/console/errors`  
**Method**: `GET`  
**Description**: Get all console errors

**Example**: `https://api.example.com/console/errors`
</details>

## TMDB

<details>
<summary><h3>Get TMDB Info by Anilist ID</h3></summary>

**URL**: `/anime/info/:id/tmdb`  
**Method**: `GET`  
**Description**: Get TMDB information using Anilist ID

**Example**: `https://api.example.com/anime/info/1/tmdb`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get TMDB Season Info</h3></summary>

**URL**: `/anime/info/:id/tmdb/season`  
**Method**: `GET`  
**Description**: Get TMDB season information for an anime

**Example**: `https://api.example.com/anime/info/1/tmdb/season`

**Path Parameters**:
```
id: number
```
</details>

## TVDB

<details>
<summary><h3>Get TVDB Info by Anilist ID</h3></summary>

**URL**: `/anime/info/:id/tvdb`  
**Method**: `GET`  
**Description**: Get TVDB information using Anilist ID

**Example**: `https://api.example.com/anime/info/1/tvdb`

**Path Parameters**:
```
id: number
```
</details>

<details>
<summary><h3>Get TVDB Translations</h3></summary>

**URL**: `/anime/info/:id/tvdb/translations/:language`  
**Method**: `GET`  
**Description**: Get TVDB translations for a specific language

**Example**: `https://api.example.com/anime/info/1/tvdb/translations/en`

**Path Parameters**:
```
id: number
language: string
```
</details>

<details>
<summary><h3>Get TVDB Available Languages</h3></summary>

**URL**: `/anime/tvdb/languages`  
**Method**: `GET`  
**Description**: Get list of available languages in TVDB

**Example**: `https://api.example.com/anime/tvdb/languages`
</details>

<details>
<summary><h3>Update TVDB Languages</h3></summary>

**URL**: `/anime/tvdb/languages`  
**Method**: `PUT`  
**Description**: Update the list of available TVDB languages

**Example**: `https://api.example.com/anime/tvdb/languages`
</details>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [Prisma](https://www.prisma.io/) - ORM
- [Consumet API](https://github.com/consumet/consumet.ts) - For anime scraping inspiration and utilities
- Various anime API providers for their data

## License

This project is [MIT licensed](LICENSE).