import Surreal from "surrealdb.js";

export default class Database {
  _db: Surreal = new Surreal();
  _endpoint: string;
  _username: string;
  _password: string;
  _database: string;

  constructor(opts: {
    endpoint: string;
    username: string;
    password: string;
    database: string;
  }) {
    this._endpoint = opts.endpoint;
    this._username = opts.username;
    this._password = opts.password;
    this._database = opts.database;
  }

  async connect(): Promise<boolean> {
    try {
      await this._db.connect(this._endpoint); //TODO: throws ReferenceError: ErrorEvent is not defined if SurrealDB Server is not running.
      console.log(this._username.trim().length);
      if (this._username.trim().length > 0) {
        await this._db.signin({
          user: this._username,
          pass: this._password,
        });
      }
      await this._db.use({
        db: this._database,
        ns: this._database,
      });
      return true;
    } catch (_err) {
      console.log(_err);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this._db.close();
  }

  get(): Surreal {
    return this._db;
  }
}
