FROM node:20-alpine

WORKDIR /app

# Install Bun
RUN npm install -g bun

# Install system dependencies
RUN apk add --no-cache git netcat-openbsd

# Copy package files
COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy the rest
COPY . .

# Fix the line endings in entrypoint.sh (convert CRLF to LF in case we are running docker on windows)
RUN sed -i 's/\r$//' ./entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

# Start app
CMD ["/bin/sh", "./entrypoint.sh"]
