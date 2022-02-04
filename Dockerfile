FROM node:17.4.0-alpine as build
RUN apk add --no-cache python3 make g++
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:17.4.0-alpine
WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
RUN npm ci --prod && npm cache clean --force
COPY . .
COPY --from=build /usr/src/app/client/dist ./client/dist
ARG VAPID_SUBJECT=${VAPID_SUBJECT}
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
RUN chown -R node:node .
USER node
CMD [ "npm", "start" ]