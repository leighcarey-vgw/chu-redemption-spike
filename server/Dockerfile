FROM node:10 as build
WORKDIR /usr/local/chu-redemption-spike

COPY package.json package-lock.json ./
#RUN npm install --production
COPY node_modules/ node_modules/

COPY . ./
RUN npm run build

FROM node:10 as dist
WORKDIR /opt/chu-redemption-spike

COPY package.json ./
COPY --from=build /usr/local/chu-redemption-spike/dist/ dist/
COPY --from=build /usr/local/chu-redemption-spike/node_modules/ node_modules/

EXPOSE 8080

CMD [ "npm", "start" ]
