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

## 🌐 Public Hosted API

We've got a public instance of Kuroji API running at **https://kuroji.1ani.me** for light usage.

> **Warn**: Public instance is not available right now.

### ⚠️ Rate Limits & Fair Usage

- **Rate Limit**: 3 requests per second
- **Please don't abuse this service** - it's provided for free to help developers test and experiment
- For production apps or heavy usage, **please host your own instance** using the installation guide

### 🙏 Respect the Service

This public API is maintained by the community for the community. If you're building something serious or expect high traffic, do everyone a solid and spin up your own deployment. The hosting guides make it pretty straightforward!

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
   POST https://your-vercel-domain.vercel.app/api/anime/index
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
   POST /api/anime/index
   ```

   This will start populating your database with anime information.

   > **Warning**: The full indexing process can take over 3 days to complete depending on your system resources and network conditions.

2. **Manual Addition**: Add specific anime to your database by fetching their details:
   ```
   GET /api/anime/info/:id
   ```

The API will only return information for anime that have been indexed in your database. If you're setting up the API for the first time, make sure to run the indexing process after installation.

## 📘 API Documentation

The full API documentation is available via [Swagger UI](https://kuroji.1ani.me/api/docs).

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
