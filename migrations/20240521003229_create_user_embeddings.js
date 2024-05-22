export async function up(knex) {
  // Check and create user_embeddings table if it doesn't exist
  const userEmbeddingsTableExists = await knex.schema.hasTable(
    "user_embeddings"
  );
  if (!userEmbeddingsTableExists) {
    await knex.schema.createTable("user_embeddings", function (table) {
      table.increments("id").primary();
      table.string("user_id", 255).notNullable();
      table.specificType("embedding", "vector(1536)").notNullable(); // Assuming the embedding size is 1536
      table.text("user_input");
      table.text("response");
      table.boolean("user_read").defaultTo(false);
      table.boolean("agent_read").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTable("user_embeddings");
}
