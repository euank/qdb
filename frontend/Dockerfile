FROM node:8 as builder

COPY . /usr/src/app/
WORKDIR /usr/src/app

RUN npm install -g bower
RUN bower install --allow-root

RUN npm install -g gulp
RUN npm install
RUN gulp

FROM nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx.conf /etc/nginx/conf.d/qdb.conf
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/
