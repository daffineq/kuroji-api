FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=./prisma/schema.prisma

RUN chmod +x ./entrypoint.sh

RUN yarn build

CMD ["./entrypoint.sh"]