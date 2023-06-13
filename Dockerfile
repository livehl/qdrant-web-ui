FROM node:18-slim as ybuild

WORKDIR /opt/

COPY ./ /opt/

RUN   npm install

RUN npm run build

FROM nginx:1-alpine-slim
COPY --from=ybuild  /opt/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["/bin/sh","-c", "nginx -g 'daemon off;'"]