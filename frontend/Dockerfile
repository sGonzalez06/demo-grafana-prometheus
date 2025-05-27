# Etapa de construcción
FROM node:16 as build
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx personalizada si es necesaria
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de construcción desde la etapa anterior
COPY --from=build /app/dist/demo-frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]