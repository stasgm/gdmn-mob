# STAGE 1
FROM node:20-slim AS builder

WORKDIR /usr/src/koa

# copy the package.json to install dependencies
COPY ./apps/web-admin/koa/package.json ./
COPY ./apps/web-admin/koa/server.js ./

# Install the dependencies
RUN yarn install

WORKDIR /usr/src/build

ARG REACT_APP_SECRET_KEY=${REACT_APP_SECRET_KEY}
ARG REACT_APP_SITE_KEY=${REACT_APP_SECRET_KEY}

ENV REACT_APP_SECRET_KEY=${REACT_APP_SECRET_KEY}
ENV REACT_APP_SITE_KEY=${REACT_APP_SITE_KEY}

# building react app
# copy the package.json to install dependencies
COPY package.json yarn.lock tsconfig.base.json tsconfig.json ./

COPY ./configs/eslint-config-react ./configs/eslint-config-react
COPY ./configs/eslint-config ./configs/eslint-config
COPY ./configs/prettier-config ./configs/prettier-config

COPY ./packages/types ./packages/types
COPY ./packages/client-types ./packages/client-types
COPY ./packages/client-config ./packages/client-config
COPY ./packages/client-api ./packages/client-api
COPY ./packages/mock  ./packages/mock
COPY ./packages/store ./packages/store

COPY ./apps/web-admin ./apps/web-admin

# Install the dependencies
RUN yarn install --production=true --immutable --immutable-cache --check-cache && yarn cache clean

# Build the project
RUN cd ./packages/store && yarn build
RUN cd ./packages/mock && yarn build
RUN cd ./packages/client-api && yarn build
RUN cd ./packages/client-config && yarn build

RUN cd ./apps/web-admin && yarn build-docker

# STAGE 2
FROM node:20-alpine3.19 AS release
# Create app directory
WORKDIR /web-admin

# Copy build from the stage 1
COPY --from=builder /usr/src/koa/node_modules ./node_modules

COPY --from=builder /usr/src/koa/server.js ./

# Copy build from the stage 2
COPY --from=builder /usr/src/build/apps/web-admin/dist ./admin

ENTRYPOINT node server.js
