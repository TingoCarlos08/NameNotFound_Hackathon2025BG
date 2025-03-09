# 1. Usamos la imagen base de Node.js para construir la app
FROM node:20 AS builder

# 2. Establecemos el directorio de trabajo
WORKDIR /app

# 3. Copiamos los archivos de dependencias y las instalamos
COPY package.json ./
RUN yarn install --frozen-lockfile

# 4. Copiamos el resto del código de la app
COPY . .

# 5. Construimos la aplicación con Vite
RUN yarn build

# 6. Usamos una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:alpine

# 7. Copiamos los archivos generados en `dist/` al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Exponemos el puerto en el que correrá Nginx
EXPOSE 80

# 9. Arrancamos el servidor
CMD ["nginx", "-g", "daemon off;"]
