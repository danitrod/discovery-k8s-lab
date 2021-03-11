FROM node:lts-alpine as SPA

WORKDIR /usr/src/app

COPY react-app/package.json ./
COPY react-app/yarn.lock ./
COPY react-app/tsconfig.json ./
COPY react-app/src src/
COPY react-app/public public/

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY server/package.json ./
COPY server/yarn.lock ./
COPY server/tsconfig.json ./
COPY server/src src/
COPY --from=SPA /usr/src/app/build server/public/

RUN yarn install --frozen-lockfile
RUN yarn build

ENV PORT 8080

EXPOSE 8080
CMD [ "yarn", "start" ]
