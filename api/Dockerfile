FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src src/

RUN yarn install --frozen-lockfile
RUN yarn build

ENV PORT 8080

EXPOSE 8080
CMD [ "yarn", "start" ]

