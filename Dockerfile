FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm cache clean --force
RUN npm install

COPY . ./

EXPOSE 3000

CMD ["node", "server.js"]