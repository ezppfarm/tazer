import { Knex, knex } from "knex";

export default class Database {
  _db: Knex;
  _host: string;
  _port: number;
  _username: string;
  _password: string;
  _database: string;

  constructor(opts: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }) {
    this._host = opts.host;
    this._port = opts.port;
    this._username = opts.username;
    this._password = opts.password;
    this._database = opts.database;
  }

  async connect(): Promise<boolean> {
    try {
      this._db = knex({
        client: "mysql2",
        connection: {
          host: this._host,
          port: this._port,
          user: this._username,
          password: this._password,
          database: this._database,
        },
      });
      await this._db.raw("SELECT 1");
      return true;
    } catch (err) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this._db.destroy();
  }

  get(): Knex {
    return this._db;
  }
}
