FROM node:20-alpine

WORKDIR /app

RUN npm install -g bun

RUN apk add --no-cache git netcat-openbsd

COPY . .

RUN bun install
