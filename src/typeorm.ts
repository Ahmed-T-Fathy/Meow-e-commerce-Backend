import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { DatabaseLogger } from 'src/logger/database-logger';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
// console.log('**********', __dirname);

// by remove thin line it will read from env vars in user in enviroment in os
dotenvConfig({ path: '.env' });
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrations: ['dist/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
  synchronize: true,
  ssl: process.env.DB_SSL === 'true' ? true : undefined,
  extra: {
    connectionTimeoutMillis: 60000,
    max: 40,
  },
  logging: true,
  // logger: new DatabaseLogger(),
  maxQueryExecutionTime: 1000,
};
export default typeOrmConfig;
