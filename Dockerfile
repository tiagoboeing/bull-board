# DEVELOPMENT
FROM node:18.12-alpine AS development

WORKDIR /app/

COPY --chown=node:node package*.json src/* ./

RUN npm ci

COPY --chown=node:node . .

USER node

# BUILD
FROM node:18.12-alpine AS build

WORKDIR /app/

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm ci --omit=dev && npm cache clean --force

USER node

# PRODUCTION
FROM node:18.12-alpine AS production

WORKDIR /app/

COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/src/views ./views

EXPOSE 4000

ARG color=auto

ENTRYPOINT ["node", "index.js"]
