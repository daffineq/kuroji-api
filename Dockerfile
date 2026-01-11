FROM node:20-alpine

WORKDIR /app

# Install Bun
RUN npm install -g bun

# Required tools
RUN apk add --no-cache git netcat-openbsd

# Copy package.json first for caching Bun install
COPY package.json ./

# Copy Drizzle config and schema
COPY drizzle.config.ts ./
COPY src/db/schema ./src/db/schema

# Install dependencies
RUN bun install

# Generate Drizzle types
RUN bun db:generate

# Copy rest of the app
COPY . .

# Fix line endings and make entrypoint executable
RUN sed -i 's/\r$//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["/bin/sh", "./entrypoint.sh"]
