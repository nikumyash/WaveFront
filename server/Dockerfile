FROM node:20.11.0-alpine as Server

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node","server.js"]