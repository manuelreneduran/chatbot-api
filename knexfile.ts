import { resolve } from "path";
import "dotenv/config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT || 5432, // default PostgreSQL port
    },
    migrations: {
      tableName: "knex_migrations",
      directory: resolve("./migrations"),
    },
  },
} as any;
