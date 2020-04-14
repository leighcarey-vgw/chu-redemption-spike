# build environment
FROM node:10 as build

WORKDIR /app/shared

COPY shared ./
RUN npm install
RUN npm run build

WORKDIR /app/client

COPY client ./
RUN npm install
RUN npm rebuild
RUN npm run build

# production environment
FROM nginx:stable
COPY --from=build /app/client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
