FROM node:18

WORKDIR /app

ENV API_KEY="c999183a91e59e2ae7af"
ENV MONGO_URI="mongodb+srv://codingvaibhav247:CICD1234@chatbridge.vsap4.mongodb.net/"
ENV RAZORPAY_KEY_ID="rzp_test_mIhosKMN4dm852"
ENV RAZORPAY_KEY_SECRET="PuLww1WUzu00h1Lwww50d4bM"
ENV CLIENT_DOMAIN="http://localhost:5173"

COPY . .

COPY package-lock.json package-lock.json
COPY package.json package.json

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]