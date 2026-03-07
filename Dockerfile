# build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN GENERATE_SOURCEMAP=false npm run build

# runtime
FROM caddy:2.11.2-alpine

COPY --from=builder /app/build /usr/share/caddy

EXPOSE 80
