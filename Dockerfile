FROM node:20.17.0-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@11.7.0
RUN npm install

CMD ["npm", "start"]

EXPOSE 5555