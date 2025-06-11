FROM oven/bun AS base

FROM base AS installer
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY ./package.json ./bun.lock ./
COPY ./patches ./patches
RUN bun ci

FROM installer AS builder
WORKDIR /app
COPY . .
RUN bun prisma:generate && bun run build

FROM builder AS runner
WORKDIR /app
ENV NODE_ENV=production
CMD bun prisma:push && bun start

