FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY ./dist ./dist

CMD [ "node", "dist/main.js" ]
