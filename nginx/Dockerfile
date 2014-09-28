# Borrowed and modified in order to remove the annoying volumes

FROM dockerfile/ubuntu
RUN \
add-apt-repository -y ppa:nginx/stable && \
apt-get update && \
apt-get install -y nginx && \
rm -rf /var/lib/apt/lists/* && \
echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
chown -R www-data:www-data /var/lib/nginx

VOLUME ["/etc/nginx/certs", "/var/log/nginx"]
# Define working directory.
WORKDIR /etc/nginx
# Define default command.
CMD ["nginx"]
# Expose ports.
EXPOSE 80
EXPOSE 443

RUN rm -rf /etc/nginx/sites-enabled/*
COPY ./qdb.conf /etc/nginx/sites-enabled/qdb.conf
