FROM node:slim
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 3500
CMD node server.js


