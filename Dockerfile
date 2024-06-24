FROM node:18.17.0-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@10.8.1
RUN npm install

CMD ["npm", "start"]

EXPOSE 5555