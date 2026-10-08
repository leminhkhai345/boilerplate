#!/bin/sh
set -e

echo "Running migrations..."
npm run migration:run || true

echo "Running seeds..."
npm run migration:seed || true

echo "Starting application..."
node dist/main.js