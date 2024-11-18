FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_AUTH_DOMAIN='dev-yonjqqa8txsc33t6.us.auth0.com'
ENV VITE_CLIENT_ID='wZzeCKZY88baNuvKazgsErVpPrfsICEA'
ENV VITE_BACKEND_DOMAIN='http://localhost:3000'
ENV VITE_RAZORPAY_KEY_ID="rzp_test_mIhosKMN4dm852"
ENV VITE_RAZORPAY_KEY_SECRET="PuLww1WUzu00h1Lwww50d4bM"

CMD ["npm", "run", "dev", "--", "--host"]
