FROM nginx:latest
ENV TZ Asia/Tokyo

RUN apt update
RUN apt upgrade -y

COPY templates/ /etc/nginx/templates/
