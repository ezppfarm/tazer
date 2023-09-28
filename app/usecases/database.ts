import knex, {Knex} from 'knex';

export default class Database {
  db: Knex;

  constructor(opts: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }) {
    this.db = knex({
      client: 'mysql2',
      connection: {
        host: opts.host,
        port: opts.port,
        user: opts.username,
        password: opts.password,
        database: opts.database,
      },
    });
  }

  async connect(): Promise<boolean> {
    try {
      await this.db.raw('SELECT 1');
      return true;
    } catch (err) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this.db.destroy();
  }

  get(): Knex {
    return this.db;
  }
}
