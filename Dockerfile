FROM node:12-alpine
WORKDIR /app
COPY package.json /app
RUN apk add --no-cache libc6-compat && apk add --no-cache git && npm install --only=prod && ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
COPY . /app
CMD node index.js
EXPOSE 9001