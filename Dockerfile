FROM node:15.2-slim as ybuild


WORKDIR /opt/

COPY ./ /opt/

RUN yarn config set registry https://registry.npm.taobao.org/

RUN  yarn install

RUN yarn build

FROM nginx:1.11.0-alpine
COPY --from=ybuild  /opt/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["/bin/sh","-c", "nginx -g 'daemon off;'"]