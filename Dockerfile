FROM node:latest

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm install
COPY ./ ./


# 指定執行dev script
CMD ["npm", "run", "start:dev"]
