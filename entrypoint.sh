#!/bin/sh

echo "⏳ Waiting for the database to wake up..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ Database is live!"

bun run migrate

bun run prod
