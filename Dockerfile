FROM node:15

ARG DATABASE_URL

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY .npmrc ./
COPY yarn.lock ./
COPY package.json ./
RUN yarn install

# Bundle app source
COPY . .

RUN yarn build

# Remove development-only dependencies:
RUN yarn --production

EXPOSE 3000
CMD [ "yarn", "start" ]
