import Knex from "knex";
import knexConfig from "../../knexfile.js";

// Initialize Knex with the development configuration
const knex = Knex(knexConfig.development);

export default knex;
