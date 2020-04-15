FROM node:10 as build

WORKDIR /usr/local/chu-redemption-spike/shared

COPY shared ./
RUN npm install
RUN npm run build

WORKDIR /usr/local/chu-redemption-spike/server

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server ./
RUN npm run build

FROM node:10 as dist

WORKDIR /opt/chu-redemption-spike/shared

COPY shared/package.json ./
COPY --from=build /usr/local/chu-redemption-spike/shared/node_modules/ node_modules/
COPY --from=build /usr/local/chu-redemption-spike/shared/dist/ dist/

WORKDIR /opt/chu-redemption-spike/server

COPY server/package.json ./
COPY --from=build /usr/local/chu-redemption-spike/server/dist/ dist/
COPY --from=build /usr/local/chu-redemption-spike/server/node_modules/ node_modules/

EXPOSE 80

CMD [ "npm", "start" ]
