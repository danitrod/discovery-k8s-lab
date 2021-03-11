FROM node:lts-alpine as BUILD

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src src/
COPY public public/

RUN yarn install --frozen-lockfile
RUN yarn build

FROM nginx:latest

COPY --from=BUILD /usr/src/app/build /usr/share/nginx/html

