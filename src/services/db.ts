import pg from "pg";
import pgvector from "pgvector/pg";

const { Client } = pg;

const pgClient = new Client({
  /* Database Config */
  password: process.env.PG_PASSWORD,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  database: process.env.PG_DATABASE,
});

async function createEmbeddingTable() {
  try {
    await pgClient.connect();
    console.log(`Connected to Postgres at port ${process.env.PG_PORT}`);
    await pgvector.registerType(pgClient);
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS user_embeddings (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                embedding VECTOR(1536) NOT NULL, -- Assuming the embedding size is 1536
                user_input TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await pgClient.query(createTableQuery);
  } catch (e) {
    console.error("Error creating table", e);
  }
}

createEmbeddingTable();

export default pgClient;
