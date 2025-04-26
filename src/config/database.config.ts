const path = require('path');
import { join } from 'path';


export default {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'dsr_db',
  models: [join(__dirname, '/../**/*.model.ts')],
  autoLoadModels: true,
  synchronize: true,
};
