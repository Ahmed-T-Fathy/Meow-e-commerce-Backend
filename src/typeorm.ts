import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService, registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });


export const config = {
  type: 'postgres',
  url:`${process.env.DATABASE_URL}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: true,
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
