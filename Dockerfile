FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM node:18-slim
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist/cocotera_api_fe/browser /app
EXPOSE 4200
CMD ["http-server", "/app", "-p", "4200"]

