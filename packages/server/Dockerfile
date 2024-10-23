# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package.json and package-lock.json
COPY package*.json ./
COPY packages/chisel/package.json ./packages/chisel/
COPY packages/server/package.json ./packages/server/
COPY packages/capsule-kit/package.json ./packages/capsule-kit/


# Copy the monorepo structure
COPY . .

# Install dependencies
RUN npm install
RUN npm run build --if-present


#RUN cd packages/server && npm ci && npm run build
#RUN cd packages/capsule-kit && npm ci && npm run build
#RUN cd packages/chisel && npm ci && npm run build

# Final stage
FROM caddy:2.7-alpine

RUN apk add --no-cache python3 make g++ gcc libc-dev

# Install Node.js in Caddy image
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# ORM
COPY --from=builder /app/packages/chisel/dist ./packages/chisel

# Server
COPY --from=builder /app/packages/server/dist ./packages/server

# Capsule-Kit
COPY --from=builder /app/packages/capsule-kit/dist ./packages/capsule-kit


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/chisel/package.json ./packages/chisel/
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/capsule-kit/package.json ./packages/capsule-kit/


# Copy the Caddyfile from the project root
COPY packages/capsule-kit/Caddyfile /etc/caddy/Caddyfile

# Install production dependencies
RUN npm install --production
RUN apk del python3 make g++ gcc libc-dev


# Expose ports for Caddy and NestJS backend
EXPOSE 80 3000

# Create start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node packages/server/main.js &' >> /app/start.sh && \
    echo 'caddy run --config /etc/caddy/Caddyfile' >> /app/start.sh

RUN chmod +x start.sh

# Command to run both Caddy and the Node.js backend
CMD ["/bin/sh", "/app/start.sh"]
