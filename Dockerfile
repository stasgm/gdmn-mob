FROM node:16.13.2-alpine3.15 as server

WORKDIR /usr/src/gdmn-mob

COPY package.json lerna.json yarn.lock tsconfig.base.json tsconfig.json ./

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
COPY ./apps/server ./apps/server

# Install our dependencies
RUN yarn install --immutable --immutable-cache --check-cache && yarn cache clean
RUN yarn lerna

RUN yarn build:lib
RUN yarn build:web-admin-linux

ENTRYPOINT yarn app:server-js
