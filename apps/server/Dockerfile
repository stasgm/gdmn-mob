# Using multi-stage build (supported Docker 17 and later)
# ------ Stage 1 (build) --------
FROM node:18.13.0-slim AS builder
# Create app directory
WORKDIR /usr/src/gdmn-mob

COPY package.json tsconfig.base.json tsconfig.json yarn.lock ./

COPY ./packages/types ./packages/types
COPY ./configs/prettier-config ./configs/prettier-config

COPY ./apps/server/package.json ./apps/server/
COPY ./apps/server/tsconfig*.json ./apps/server/
COPY ./apps/server/config ./apps/server/config

# Install app dependencies from package
RUN yarn install --production=true --immutable --immutable-cache --check-cache && yarn cache clean

# Copy source code to image after yarn install to use caching efficient
COPY ./apps/server/src ./apps/server/src
# Build prod to ./dist folder for deploy later
RUN cd ./apps/server && yarn build

# # ------ Stage 2 (release) ------
FROM node:18.13.0-alpine3.17 AS release
# Create app directory
WORKDIR /gdmn-mob
# Copy dist files
COPY --from=builder /usr/src/gdmn-mob/apps/server/dist ./dist
COPY --from=builder /usr/src/gdmn-mob/node_modules ./node_modules

ENTRYPOINT node ./dist/src/index.js

