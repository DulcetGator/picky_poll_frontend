# pull official base image
FROM node:15.1.0-alpine as BUILD

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

# start app
FROM nginx:stable-alpine as SERVE
COPY --from=BUILD /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]