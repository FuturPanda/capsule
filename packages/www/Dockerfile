# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=23.5.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="SvelteKit"

WORKDIR /app

ENV NODE_ENV="production"


FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package-lock.json package.json ./
RUN rm -f package-lock.json && \
    npm install --package-lock-only --no-workspaces
RUN npm ci --include=dev

COPY . .

RUN npm run build
# Final stage for app image
FROM base

COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

EXPOSE 3000
CMD [ "node", "./build/index.js" ]
