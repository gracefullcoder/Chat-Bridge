FROM node:18

WORKDIR /app

COPY . .

COPY package-lock.json package-lock.json
COPY package.json package.json

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]