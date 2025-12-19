<p align="center">
  <a href="https://github.com/daffineq/kuroji-api">
    <img src="https://raw.githubusercontent.com/veaquer/kuroji-api/main/public/img/logo.svg" alt="Logo" width="100%" style="max-height: 300px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" />
  </a>
</p>

<h1 align="center">Kuroji API v2</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white" alt="Bun"></a>
  <a href="#"><img src="https://img.shields.io/badge/Elysia-FD4F00?style=flat&logo=elysia&logoColor=white" alt="Elysia"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white" alt="GraphQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

<p align="center">
  <strong>A high-performance anime API built with modern web technologies</strong>
</p>

---

## Features

- **REST & GraphQL APIs** - Dual API support for maximum flexibility
- **Rate Limiting** - Configurable rate limits to protect your server
- **Route Protection** - Flexible authentication strategies
- **OpenAPI Documentation** - Auto-generated API docs with Scalar UI
- **Proxy Endpoints** - Built-in proxy functionality
- **Error Handling** - Comprehensive error responses with detailed stack traces
- **CORS Support** - Configurable cross-origin resource sharing
- **Logging System** - Built-in request/response logging with log retrieval endpoint

---

## Installation

```bash
# Clone the repository
git clone https://github.com/daffineq/kuroji-api.git
cd kuroji-api

# Install dependencies
bun install

# Set up your environment variables
cp .env.example .env

# Generate Prisma client
bun run generate
```

---

## Configuration

See the [.env.example](.env.example)

---

## Running the API

```bash
# Development mode (with hot reload)
bun run dev

# Production mode
bun run prod

# Database migrations
bun run migrate          # Deploy migrations
bun run migrate:dev      # Create and apply new migration
bun run reset            # Reset database

# Prisma operations
bun run generate         # Generate Prisma client
bun run merge            # Merge Prisma schemas
bun run mrgn             # Merge and generate

# Type checking
bun run tsc              # Watch mode type checking
```

The API will be available at `http://localhost:3000` (or your configured PORT)

---

## API Documentation

Once the server is running, access the interactive documentation:

- **Scalar UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/openapi`
- **GraphQL Playground**: `http://localhost:3000/graphql`

---

## Routes

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/docs` | Interactive API documentation |
| GET | `/docs/openapi` | OpenAPI JSON schema |
| GET | `/logs` | View server logs |
| GET/POST | `/graphql` | GraphQL endpoint & playground |
| * | `/api/*` | Anime & API routes |
| * | `/proxy/*` | Proxy endpoints |

---

## Tech Stack

- **[Hono](https://hono.dev/)** - Ultra-fast web framework for the edge
- **[Bun](https://bun.sh/)** - All-in-one JavaScript runtime and toolkit
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM with PostgreSQL adapter
- **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** - Fully-featured GraphQL server
- **[Scalar](https://github.com/scalar/scalar)** - Modern API documentation UI
- **[Ky](https://github.com/sindresorhus/ky)** - Tiny and elegant HTTP client
- **[IORedis](https://github.com/redis/ioredis)** - Robust Redis client for Node.js
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation with static type inference

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Hono](https://hono.dev/)
- Powered by [Bun](https://bun.sh/)
- Documentation by [Scalar](https://github.com/scalar/scalar)

---

<p align="center">
  Made by <a href="https://github.com/daffineq">daffineq</a>
</p>

<p align="center">
  <a href="https://github.com/daffineq/kuroji-api/stargazers">Star this repo if you find it useful</a>
</p>
