FROM node:20.11.0-alpine as Client

WORKDIR /usr/src/app
COPY package*.json .

RUN npm install

COPY . . 

CMD ["/bin/sh","-c","npm run build"]
