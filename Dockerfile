# pull official base image
FROM node:15.1.0-alpine as BUILD

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY public ./public
COPY src ./src
copy tsconfig.json ./

RUN yarn build

# start app
FROM nginx:stable-alpine as SERVE
COPY --from=BUILD /app/build /usr/share/nginx/html
COPY /operations/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]