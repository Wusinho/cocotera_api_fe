# Stage 1: Build the angular application
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration=production

# Stage 2: Serve the application from Nginx
FROM nginx:alpine

COPY --from=build /app/dist/cocotera_api_fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
