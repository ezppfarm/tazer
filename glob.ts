import Database from './app/usecases/database';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as logger from './app/log/logger';
import {domainValidator} from './app/utils/validatorUtils';

const REQUIRED_ENV_KEYS = ['HTTP_PORT', 'MYSQL_HOST', 'MYSQL_DB'];
let _database: Database;

export function loadEnv() {
  const envFile = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envFile)) return undefined;
  const missingEnvKeys: string[] = [];
  dotenv.config();
  for (const envKey of REQUIRED_ENV_KEYS) {
    if (!getEnv(envKey)) missingEnvKeys.push(envKey);
  }
  return missingEnvKeys;
}

export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ? (process.env[key] as string) : defaultValue;
}

export async function database(dbInit?: Database) {
  if (!_database) {
    if (!dbInit) {
      throw Error('Database is not initialized.');
    }
    logger.info('Connecting to database...');
    _database = dbInit;
    const connected = await _database.connect();
    if (!connected) throw Error('Failed to connect to database!');
    logger.success('Database connection success!');
  }
  return _database.get();
}

export const getDataFolder = (dataFolder: 'avatars') => {
  return path.join(process.cwd(), '.data', dataFolder);
};

export const getDomain = (sub?: 'avatar') => {
  const domain = getEnv(sub ? `${sub.toUpperCase() + '_DOMAIN'}` : 'DOMAIN');
  if (!domain || !domainValidator.parse(domain)) {
    throw Error(
      `${sub ? `${sub.toUpperCase() + '_DOMAIN'}` : 'DOMAIN'} in .env not set!`
    );
  }
  return domain;
};
