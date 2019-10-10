FROM node:12-alpine
WORKDIR /app
COPY package.json /app
RUN apk add --no-cache git && npm install --only=prod
COPY . /app
CMD node index.js
EXPOSE 9001