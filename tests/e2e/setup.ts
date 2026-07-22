import { PostgresDataSource } from '../../src/infrastructure';

// Aumentar timeout para que dé tiempo a levantar contenedores si hace falta
jest.setTimeout(30000);

beforeAll(async () => {
  // Inicializar base de datos PostgreSQL
  if (!PostgresDataSource.isInitialized) {
    await PostgresDataSource.initialize();
  }

});

afterAll(async () => {
  // Limpiar BD después de las pruebas
  if (PostgresDataSource.isInitialized) {
    const entities = PostgresDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = PostgresDataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
    await PostgresDataSource.destroy();
  }
});
