FROM node:24-slim AS build
WORKDIR /app
COPY package.json yarn.lock* ./
RUN corepack enable && yarn install --immutable
COPY . .
RUN yarn build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
