# build environment
FROM node:10 as build
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm install
RUN npm rebuild
#RUN npm install react-scripts -g
RUN npm run build

# production environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
