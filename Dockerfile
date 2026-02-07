# syntax=docker/dockerfile:1

# =========================
# deps
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# 依存関係だけ先に入れてキャッシュを効かせる
COPY package.json package-lock.json ./
RUN npm ci

# =========================
# dev
# =========================
FROM node:20-alpine AS dev
WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

EXPOSE 3002
CMD ["npm", "run", "dev"]

# =========================
# build
# =========================
FROM node:20-alpine AS build
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN npm run build

# =========================
# runner
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js 実行に必要なものだけ持っていく
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/next.config.ts /app/next.config.ts

EXPOSE 3002
CMD ["npm", "start"]