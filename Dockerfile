FROM node:4.1.2

WORKDIR /home/user/duelo

ADD node_modules/ ./node_modules
ADD bower_components/ ./bower_components
ADD content/ ./content
ADD lib/ ./lib
ADD main.js ./
ADD *.json ./
ADD sh/web.proc ./sh/

#RUN [ "npm", "install", "--harmony", "--unsafe-perm", "--loglevel", "warn" ]

ENV MONGODB_URL mongodb://mongohost/duelo_test
EXPOSE 3000
CMD ./sh/web.proc
