import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { environment } from './environment';


const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking Manager API',
      version: '1.0.0',
      description:
        'API REST para gestionar usuarios, vehículos, reservas y ocupación de plazas de estacionamiento.',
    },
    servers: [
      {
        url: `http://localhost:${environment.port}`,
        description: 'Servidor local de desarrollo',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y registro' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Vehicles', description: 'Gestión de vehículos' },
      { name: 'Parking Spots', description: 'Gestión de plazas' },
      { name: 'Reservations', description: 'Gestión de reservas' },
      { name: 'System', description: 'Estado y salud de la API' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en /api/auth/login',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/presentation/routes/**/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Parking Manager API Docs',
    }),
  );

  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
