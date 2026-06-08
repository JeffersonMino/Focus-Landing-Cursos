#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/focuscomunicacion-landing}"
IMAGE_NAME="${IMAGE_NAME:-focuscomunicacion-landing}"

echo "Building ${IMAGE_NAME}..."
docker compose -f docker-compose.prod.yml build

echo "Starting production containers..."
docker compose -f docker-compose.prod.yml up -d

cat <<'INFO'

Production stack is running.

Suggested VPS reverse proxy:
  server {
    server_name focuscomunicacion.com www.focuscomunicacion.com;
    location / {
      proxy_pass http://127.0.0.1:8080;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }

Enable SSL with:
  sudo certbot --nginx -d focuscomunicacion.com -d www.focuscomunicacion.com

INFO
