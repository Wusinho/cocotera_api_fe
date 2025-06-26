
# Etapa de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

# Etapa de producción
FROM node:18-slim
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/cocotera_api_fe/browser .
EXPOSE 4200
CMD ["http-server", "-p", "4200"]

