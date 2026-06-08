$ErrorActionPreference = "Stop"

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

Write-Host "FocusComunicacion production preview: http://localhost:8080"
