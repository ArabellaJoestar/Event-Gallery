FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /assets/images /assets/documents /assets/videos

EXPOSE 3472

CMD ["npm", "start"]