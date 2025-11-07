FROM ubuntu:22.04
LABEL maintainer="training"

# Combine update et install dans la même couche
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y nginx git && \
    rm -rf /var/lib/apt/lists/*

RUN rm -rf /var/www/html/*
RUN git clone https://github.com/BabaVickAym/Biblioteque.git /var/www/html

EXPOSE 80
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
