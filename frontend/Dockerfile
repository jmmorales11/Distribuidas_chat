# Usa la imagen oficial de Node.js como base
FROM node:18

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install



# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Expone el puerto en el que Vite ejecutará la aplicación
EXPOSE 5173

# Comando para ejecutar la aplicación en desarrollo
#CMD ["npm", "run", "dev", "--", "--host"]
CMD ["npm", "start"]