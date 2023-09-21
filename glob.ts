import Database from "./usecases/database";
import * as dotenv from "dotenv";

const requiredEnvKeys = ["HTTP_PORT", "SURREAL_HOST", "SURREAL_DB"];
let _database: Database;

export function loadEnv() {
  const missingEnvKeys: string[] = [];
  dotenv.config();
  for (const envKey of requiredEnvKeys) {
    if (!getEnv(envKey)) missingEnvKeys.push(envKey);
  }
  return missingEnvKeys;
}

export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ? process.env[key] as string : defaultValue;
}

export async function database(dbInit?: Database) {
  if (!_database) {
    if (!dbInit) {
      throw Error("Database is not initialized.");
    }
    _database = dbInit;
    const connected = await _database.connect();
    if (!connected) throw Error("Failed to connect to database!");
    console.log("Database connection success!");
  }
  return _database;
}
