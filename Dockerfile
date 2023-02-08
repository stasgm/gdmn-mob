FROM node:16.13.2-alpine3.15

# Install fresh packages, neat trick:
# Create new layer, to make sure that changing a code doesn't require installing node modules again
COPY ./package.json /tmp/node-cache/
COPY ./yarn.lock /tmp/node-cache/

# Install our dependencies
RUN cd /tmp/node-cache && yarn

# Create app directory
WORKDIR /usr/src/app

# Copy other project files to our container
COPY . /usr/src/app

# Copy node modules
RUN cp -rf /tmp/node-cache/node_modules ./node_modules

# run the app
ENTRYPOINT yarn start
