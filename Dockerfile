FROM node:4.1.2

WORKDIR /home/user/duelo

COPY node_modules/ ./node_modules
COPY bower_components/ ./bower_components
COPY content/ ./content
COPY lib/ ./lib
COPY main.js ./
COPY *.json ./
COPY sh/web.proc ./sh/

ENV PORT=80
EXPOSE 80
CMD ./sh/web.proc
