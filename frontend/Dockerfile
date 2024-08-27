FROM node:20.15.0-alpine

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .
