FROM node:4.1.2

WORKDIR /home/user/duelo
VOLUME /home/user/duelo

ENV MONGODB_URL=mongodb://mongohost/duelo_test PORT=80
EXPOSE 80
CMD ./sh/web.proc
