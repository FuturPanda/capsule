FROM node:18-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY packages/chisel/package.json ./packages/chisel/
COPY packages/server/package.json ./packages/server/
COPY packages/capsule-kit/package.json ./packages/capsule-kit/

COPY . .

RUN npm install
RUN npm run build --if-present


#RUN cd packages/server && npm ci && npm run build
#RUN cd packages/capsule-kit && npm ci && npm run build
#RUN cd packages/chisel && npm ci && npm run build

FROM debian:bullseye-slim

RUN apt-get update \
    && apt-get install -y \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    curl \
    gnupg2 \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y \
    caddy \
    nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/packages/chisel/dist ./packages/chisel
COPY --from=builder /app/packages/server/dist ./packages/server
COPY --from=builder /app/packages/capsule-kit/dist ./packages/capsule-kit

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/chisel/package.json ./packages/chisel/
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/capsule-kit/package.json ./packages/capsule-kit/

COPY packages/capsule-kit/Caddyfile /etc/caddy/Caddyfile

RUN npm install --production

EXPOSE 80 3000

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node packages/server/main.js &' >> /app/start.sh && \
    echo 'caddy run --config /etc/caddy/Caddyfile' >> /app/start.sh

RUN chmod +x start.sh

ENV DEBIAN_FRONTEND=noninteractive

CMD ["/bin/sh", "/app/start.sh"]