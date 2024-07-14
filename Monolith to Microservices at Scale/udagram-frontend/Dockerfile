# Use NodeJS base image
FROM node:16-alpine as build
ARG BUILD_ENV

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g ionic
RUN npm ci

# Copy app source
COPY . .

RUN echo $BUILD_ENV

RUN ionic build

# Run with Nginx base image 
FROM nginx:alpine

# COPY www /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build  /usr/src/app/www /usr/share/nginx/html