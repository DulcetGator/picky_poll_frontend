# pull official base image
FROM node:15.1.0-alpine as BUILD

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

RUN yarn build

FROM BUILD as TEST
ENV CI=true
COPY .eslintignore ./
COPY .eslintrc.js ./
RUN yarn lint
RUN yarn test

# start app
FROM nginx:stable-alpine as SERVE
COPY --from=BUILD /app/build /usr/share/nginx/html
COPY /operations/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]