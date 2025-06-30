FROM oven/bun:1

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y git netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./

COPY prisma ./prisma

RUN bun install --frozen-lockfile

COPY . .

RUN bun run prisma generate --schema=./prisma/schema.prisma

RUN chmod +x ./entrypoint.sh

# Build app
RUN bun run build

# Start app
CMD ["./entrypoint.sh"]
