# React Chat App

Este proyecto es un sistema de chat en tiempo real desarrollado con React para el frontend y Spring Boot para el backend.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
- [Docker](https://www.docker.com/)

## Instalación y ejecución

### Construcción de la imagen Docker

Para construir la imagen Docker del frontend, navega hasta la carpeta `frontend` y ejecuta el siguiente comando:

```sh
cd frontend
docker build -t react-app .
```

### Ejecución del contenedor

Una vez construida la imagen, ejecuta el contenedor con:

```sh
docker run -p 3000:3000 react-app
```

Esto iniciará e ingresa al siguiente link http://localhost:3000/
