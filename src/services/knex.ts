import Knex from "knex";
// @ts-ignore
import knexConfig from "../../knexfile.js";

// Initialize Knex with the development configuration
const knexClient = Knex(knexConfig.development);

export const runMigrations = async () => {
  try {
    console.log("Running migrations...");
    await knexClient.migrate.latest();
    console.log("Migrations completed!");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
};

export default knexClient;
