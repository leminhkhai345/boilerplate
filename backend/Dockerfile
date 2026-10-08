FROM node:22-slim AS dist

WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend .
RUN npm run build  # Chạy build với NestJS

FROM node:22-slim AS node_modules
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

FROM node:22-slim
ARG PORT=80
WORKDIR /usr/src/app

COPY --from=dist /app/dist /usr/src/app/dist
COPY --from=node_modules /app/node_modules /usr/src/app/node_modules
COPY backend /usr/src/app

EXPOSE $PORT

COPY backend/start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
