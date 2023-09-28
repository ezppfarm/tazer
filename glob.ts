import Database from './usecases/database';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {z} from 'zod';

const requiredEnvKeys = ['HTTP_PORT', 'MYSQL_HOST', 'MYSQL_DB'];
let _database: Database;

export function loadEnv() {
  const envFile = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envFile)) return undefined;
  const missingEnvKeys: string[] = [];
  dotenv.config();
  for (const envKey of requiredEnvKeys) {
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
    _database = dbInit;
    const connected = await _database.connect();
    if (!connected) throw Error('Failed to connect to database!');
    console.log('Database connection success!');
  }
  return _database.get();
}

export const getDataFolder = (dataFolder: 'avatars') => {
  return path.join(process.cwd(), '.data', dataFolder);
};

export const getDomain = (sub?: 'avatar' | 'api') => {
  const domain = getEnv(sub ? `${sub.toUpperCase() + '_DOMAIN'}` : 'DOMAIN');
  if (!domain) {
    throw Error(
      `${sub ? `${sub.toUpperCase() + '_DOMAIN'}` : 'DOMAIN'} in .env not set!`
    );
  }
  return domain;
};
