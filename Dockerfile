FROM ubuntu:22.04
LABEL maintainer="training"
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx && \
    apt-get clean
RUN rm -Rf /var/www/html/*
COPY . /var/www/html
EXPOSE 80
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
