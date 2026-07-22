import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { environment } from './config/environment';
import { PostgresDataSource } from './infrastructure';
import { router, errorHandlerMiddleware } from './presentation';
import { setupSwagger } from './config/swagger';


class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    setupSwagger(this.app);

    this.app.use('/api', router);

    /**
     * @openapi
     * /health:
     *   get:
     *     tags: [System]
     *     summary: Health Check
     *     description: Check the health status of the API
     *     security: []
     *     responses:
     *       '200':
     *         description: API is running smoothly
     */
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'OK', message: 'API is running smoothly' });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandlerMiddleware);
  }

  public async start() {
    try {
      await PostgresDataSource.initialize();
      console.log('✅ Connected to PostgreSQL database');

      this.app.listen(environment.port, () => {
        console.log(`🚀 Server running at http://localhost:${environment.port}`);
        console.log(`🔗 Environment: ${environment.nodeEnv}`);
      });
    } catch (error) {
      console.error('❌ Error starting the application:', error);
      process.exit(1);
    }
  }
}

const app = new App();

const isTestRun = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;

if (!isTestRun) {
  app.start();
}

export default app.app;
