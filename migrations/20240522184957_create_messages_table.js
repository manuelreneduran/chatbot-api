export async function up(knex) {
  // Check and create user_embeddings table if it doesn't exist
  const messagesTableExists = await knex.schema.hasTable("messages");
  if (!messagesTableExists) {
    await knex.schema.createTable("messages", function (table) {
      table.increments("id").primary();
      table.string("user_id", 255).notNullable();
      table.text("text");
      table.boolean("user_read").defaultTo(false);
      table.boolean("agent_read").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTable("user_embeddings");
}
