export async function up(knex) {
  // Check and create reference_texts table if it doesn't exist
  const referenceTextsTableExists = await knex.schema.hasTable(
    "reference_texts"
  );
  if (!referenceTextsTableExists) {
    await knex.schema.createTable("reference_texts", function (table) {
      table.increments("id").primary();
      table.string("title", 255);
      table.specificType("embedding", "vector(1536)").notNullable(); // Assuming the embedding size is 1536
      table.text("text").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTable("reference_texts");
}
