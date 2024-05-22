export async function up(knex) {
  // Check and create messages table if it doesn't exist
  const messagesTableExists = await knex.schema.hasTable("messages");
  if (!messagesTableExists) {
    await knex.schema.createTable("messages", function (table) {
      table.increments("id").primary();
      table.string("user_id", 255).notNullable();
      table.text("text");
      table.text("user_type").notNullable();
      table.boolean("read").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTable("messages");
}
