FROM node:12-buster-slim

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]