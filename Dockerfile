FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate --schema=./prisma/schema.prisma

RUN chmod +x ./entrypoint.sh

RUN yarn build

CMD ["./entrypoint.sh"]