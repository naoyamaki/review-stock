FROM nginx:mainline-alpine AS build

# build headers-more-nginx-module in this image
# this module detail -> https://github.com/openresty/headers-more-nginx-module
ENV HEADERS_MORE_NGINX_MODULE_VERSION 0.34

RUN cd /tmp \
  && wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz -O nginx-${NGINX_VERSION}.tar.gz \
  && wget https://github.com/openresty/headers-more-nginx-module/archive/refs/tags/v${HEADERS_MORE_NGINX_MODULE_VERSION}.tar.gz -O headers-more-nginx-module-${HEADERS_MORE_NGINX_MODULE_VERSION}.tar.gz \
  && apk add --no-cache --virtual dependency gcc libc-dev make openssl-dev pcre-dev zlib-dev linux-headers \
  && tar zxf nginx-${NGINX_VERSION}.tar.gz \
  && tar zxf headers-more-nginx-module-${HEADERS_MORE_NGINX_MODULE_VERSION}.tar.gz  \
  && cd nginx-${NGINX_VERSION} \
  && CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^configure arguments: //p') \
  && sh -c "./configure --with-compat ${CONFARGS} --add-dynamic-module=../headers-more-nginx-module-${HEADERS_MORE_NGINX_MODULE_VERSION}" \
  && make modules \
  && apk del dependency \
  && rm -rf /var/cache/apk/*

FROM nginx:mainline-alpine
ENV TZ Asia/Tokyo

RUN apk update
COPY --from=build /tmp/nginx-${NGINX_VERSION}/objs/ngx_http_headers_more_filter_module.so /etc/nginx/modules/ngx_http_headers_more_filter_module.so
COPY templates/ /etc/nginx/templates/
COPY ./nginx.conf /etc/nginx/nginx.conf
