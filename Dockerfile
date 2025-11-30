FROM node:20-alpine

WORKDIR /app

RUN npm install -g bun

RUN apk add --no-cache git netcat-openbsd

COPY package.json ./
COPY prisma ./prisma

RUN bun install

RUN bun generate

COPY . .

RUN sed -i 's/\r$//' ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

CMD ["/bin/sh", "./entrypoint.sh"]
