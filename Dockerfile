FROM oven/bun:1

WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y git netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json first
COPY package.json ./

# Initialize bun and install dependencies
RUN bun install && \
    bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bun run prisma generate --schema=./prisma/schema.prisma

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

# Build the application
RUN bun run build

# Run the application
CMD ["./entrypoint.sh"]