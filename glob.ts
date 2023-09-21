import Database from "./usecases/database.ts";

let _database: Database;

export const database = async (dbInit?: Database) => {
  if (!database) {
    if (!dbInit) {
      throw Error("Database is not initialized.");
    }
    _database = dbInit;
    const connected = await _database.connect();
    if (!connected) throw Error("Failed to connect to database!");
  }
  return _database;
};
