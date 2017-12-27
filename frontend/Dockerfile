FROM node:8

COPY . /usr/src/app/
WORKDIR /usr/src/app

RUN npm install -g bower
RUN bower install --allow-root

RUN npm install -g gulp
RUN npm install
RUN gulp

VOLUME ["/usr/src/app/dist"]
