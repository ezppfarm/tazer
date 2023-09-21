import Surreal from "https://deno.land/x/surrealdb@v0.9.0/mod.ts";

export default class Database {
  #db: Surreal = new Surreal();
  #endpoint: string;
  #username: string;
  #password: string;

  constructor(opts: {
    endpoint: string;
    username: string;
    password: string;
  }) {
    this.#endpoint = opts.endpoint;
    this.#username = opts.username;
    this.#password = opts.password;
  }

  async connect() {
    try {
      await this.#db.connect(this.#endpoint);
      await this.#db.signin({
        user: this.#username,
        pass: this.#password,
      });
      await this.#db.use({
        db: "tazer",
      });
      return true;
    } catch (_err) {
      return false;
    }
  }

  async disconnect() {
    await this.#db.close();
  }

  get() {
    return this.#db;
  }
}
