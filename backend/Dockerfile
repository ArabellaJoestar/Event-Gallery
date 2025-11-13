FROM node:22-alpine3.21

WORKDIR /backend

COPY . .

RUN npm install

RUN mkdir -p assets/documents assets/images

EXPOSE 3472

CMD ["npm", "start"]