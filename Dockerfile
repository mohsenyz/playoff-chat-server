FROM node:12-stretch
WORKDIR /app
COPY package.json /app
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git && npm install --only=prod
COPY . /app
CMD node index.js
EXPOSE 9001