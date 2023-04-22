FROM node:18-alpine

WORKDIR /app

ARG SERVER_SKIP_CI

COPY --chown=node:node . .

RUN if [ -z "$SERVER_SKIP_CI" ] || [ $SERVER_SKIP_CI != 1 ]; then npm ci; fi

RUN npm run build

RUN mkdir -p /app/coverage && mkdir -p /app/logs && chown -R node:node /app/coverage && chown -R node:node /app/logs

USER node

CMD ["/bin/sh", "-c", "npm run migration:up && npm run seed:up && if [ $NODE_ENV == test ]; then npm test; else npm run start; fi"]

EXPOSE 3000
