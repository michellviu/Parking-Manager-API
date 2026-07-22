# 🅿️ Parking Manager API

Esta es la implementación de la API para la gestión de un parking, desarrollada utilizando **Node.js, TypeScript, Express y TypeORM**, estructurada bajo los principios de **Clean Architecture**.

## 🏗️ Arquitectura (Clean Architecture)

El proyecto está estructurado en 4 capas principales para garantizar la separación de responsabilidades, testabilidad e independencia de frameworks:

1. **Domain Layer (`src/domain/`)**: Contiene la lógica central del negocio. Entidades, Enums e Interfaces. No depende de ninguna otra capa.
2. **Infrastructure Layer (`src/infrastructure/`)**: Implementaciones concretas de las interfaces del dominio. Aquí se encuentran las configuraciones de bases de datos (PostgreSQL y MongoDB), Modelos ORM/ODM y los Repositorios reales.
3. **Services Layer (`src/services/`)**: Contiene los `Managers` que orquestan los casos de uso y la lógica de negocio. Dependen de las interfaces del dominio.
4. **Presentation Layer (`src/presentation/`)**: Capa externa que interactúa con el cliente. Contiene controladores, rutas de Express, Middlewares (Autenticación y Roles) y DTOs.

## 🚀 Tecnologías Principales

- **Runtime:** Node.js + TypeScript
- **Framework Web:** Express.js
- **Bases de Datos:**
  - **PostgreSQL**: Base de datos principal relacional para Entidades del negocio (TypeORM).
  - **MongoDB**: Base de datos documental para almacenar Logs de actividad (Mongoose).
- **Autenticación:** JWT (JSON Web Tokens) y Bcrypt para hashing de contraseñas.
- **Testing:** Jest + Supertest (Pruebas E2E).
- **Contenedores:** Docker y Docker Compose.

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio y entrar a la carpeta**

   ```bash
   git clone https://github.com/michellviu/Parking-Manager-API
   cd Parking-Manager-API
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Existe un archivo `.env` ya configurado para desarrollo local (puedes basarte en `.env.example`).

4. **Levantar las bases de datos con Docker**
   Asegúrate de tener Docker corriendo e inicia PostgreSQL y MongoDB:

   ```bash
   docker-compose up -d
   ```

5. **Ejecutar la API en modo desarrollo**

   ```bash
   npm run dev
   ```

   La API estará disponible en `http://localhost:3000`.

6. **(Opcional) Compilar para producción**

   ```bash
   npm run build
   npm start
   ```

## 🧪 Ejecutar Pruebas E2E

Se han implementado pruebas E2E automatizadas para los 3 casos de uso principales. Para ejecutarlas (asegúrate de que los contenedores de DB estén corriendo):

```bash
npm run test
```

## 🔐 Autenticación y Roles

La API utiliza un sistema de roles (`admin`, `empleado`, `cliente`). Debes registrarte y hacer login para obtener un Bearer Token JWT. Para probar los endpoints protegidos, envía el token en el Header:
`Authorization: Bearer <tu_token_jwt>`

## 📖 Colección de Postman

En la raíz del proyecto encontrarás el archivo `Parking-Manager-API.postman_collection.json`. Importa este archivo en Postman para probar todos los endpoints fácilmente. La colección incluye requests de ejemplo para todos los Casos de Uso.
