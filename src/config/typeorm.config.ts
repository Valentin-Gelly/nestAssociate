import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const typeOrmConfig: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'rootpassword',
  database: process.env.DB_NAME || 'associate',
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
};
