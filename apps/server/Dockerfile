# FROM oven/bun:alpine AS base
FROM node:22-slim AS base

ARG NODE_ENV
ARG VITE_NODE_ENV
ARG VITE_SERVER_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# RUN apk add --no-cache python3 make g++ bash nodejs pkgconf cairo-dev pango-dev libpng libjpeg librsvg pixman-dev giflib-dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    bash \
    git \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg62-turbo-dev \
    librsvg2-dev \
    libpixman-1-dev \
    libgif-dev \
    curl \
    ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN bash bun add -g pnpm
RUN npm add -g pnpm bun


FROM base AS build

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod false && pnpm build
RUN ./scripts/download-models.sh


FROM base AS deploy

WORKDIR /app

COPY --from=build /app ./

EXPOSE $PORT

CMD ["pnpm", "--filter", "@embedded-blockchain-surveillance-system/server", "start"]
