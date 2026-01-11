FROM node:20-alpine

WORKDIR /app

# Install Bun
RUN npm install -g bun

# Required tools
RUN apk add --no-cache git netcat-openbsd

COPY . .

# Install dependencies
RUN bun install

# Generate Drizzle types
RUN bun db:generate

# Fix line endings and make entrypoint executable
RUN sed -i 's/\r$//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["/bin/sh", "./entrypoint.sh"]
