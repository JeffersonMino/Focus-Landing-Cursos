FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build:prod

FROM nginx:1.27-alpine AS production

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/focuscomunicacion-landing/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
