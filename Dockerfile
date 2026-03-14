# build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN GENERATE_SOURCEMAP=false npm run build

# runtime
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA 라우팅 처리
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

FROM nginx:alpine

COPY dist /usr/share/nginx/html
