####################################
# Base image
####################################
FROM node:14.15.5-alpine AS base

WORKDIR /base

COPY package*.json ./
COPY .npmrc ./
COPY nodemon.json ./
COPY tsconfig.json ./
COPY .prettierrc.js ./
COPY .prettierignore ./
COPY .eslintrc.js ./
COPY .eslintignore ./

COPY src ./src
COPY prisma ./prisma

RUN npm install npm@6.14
RUN npm ci --production


####################################
# Build process
####################################
FROM base AS build

ENV NODE_ENV=production

WORKDIR /build

COPY --from=base /base ./

RUN npm run build


####################################
# Production image
####################################
FROM node:14.15.5-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/.npmrc ./
COPY --from=build /build/prisma ./
COPY --from=build /build/nodemon.json ./
COPY --from=build /build/tsconfig.json ./
COPY --from=build /build/.prettierrc.js ./
COPY --from=build /build/.prettierignore ./
COPY --from=build /build/.eslintrc.js ./
COPY --from=build /build/.eslintignore ./

COPY --from=build /build/dist ./dist
COPY --from=build /build/prisma ./prisma
COPY --from=build /build/node_modules ./node_modules

# Expose port
EXPOSE $PORT

# Run command
CMD npm run migrate && \
  node ./dist/src/index.js
