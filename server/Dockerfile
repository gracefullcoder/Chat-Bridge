FROM node:18

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.js server.js

EXPOSE 3000

RUN npm install

CMD ["npm", "start"]