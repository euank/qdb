# Borrowed and modified in order to remove the annoying volumes

FROM nginx:latest
RUN rm -rf /etc/nginx/conf.d/*
COPY ./qdb.conf /etc/nginx/conf.d/qdb.conf
