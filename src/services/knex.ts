import Knex from "knex";
// @ts-ignore
import knexConfig from "../../knexfile.js";

// Initialize Knex with the development configuration
const knexClient = Knex(knexConfig.development);

export default knexClient;
