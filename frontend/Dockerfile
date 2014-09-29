FROM node:0.10-onbuild

RUN npm install -g bower
RUN bower install --allow-root

RUN npm install -g gulp
RUN gulp

VOLUME ["/usr/src/app/dist"]

ENTRYPOINT /bin/bash
# Sleep forever for fig
CMD while true; do sleep 1; done
