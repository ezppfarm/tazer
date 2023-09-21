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
      await this._db.connect(this._endpoint);
      const signin = await this._db.signin({
        user: this._username,
        pass: this._password,
      });
      //TODO: check invalid credentials
      // console.log(signin);
      await this._db.use({
        db: this._database,
      });
      return true;
    } catch (_err) {
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
