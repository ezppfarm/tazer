import Database from "./usecases/database.ts";
import * as path from "https://deno.land/std@0.201.0/path/mod.ts";
import { load } from "https://deno.land/x/tiny_env@1.0.0/mod.ts";
import { fileExists } from "./utils/fileUtil.ts";
if (await fileExists(path.join(Deno.cwd(), ".env"))) {
  load();
} else {
  console.log(".env file not existing.");
  Deno.exit(0);
}

let _database: Database;

export const database = async (dbInit?: Database) => {
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
};

export const getEnv = (key: string, defaultValue: string): string => {
  return Deno.env.has(key)
    ? (Deno.env.get(key) as string).trim()
    : defaultValue.trim();
};
