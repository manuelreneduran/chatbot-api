export async function up(knex) {
  const reactionsTableExists = await knex.schema.hasTable("reactions");
  if (!reactionsTableExists) {
    return knex.schema.createTable("reactions", function (table) {
      table.increments("id").primary();
      table.integer("message_id").unsigned().notNullable();
      table.boolean("like").defaultTo(false);
      table.boolean("love").defaultTo(false);
      table.boolean("haha").defaultTo(false);
      table.boolean("wow").defaultTo(false);
      table.boolean("sad").defaultTo(false);
      table.boolean("angry").defaultTo(false);
      table
        .foreign("message_id")
        .references("id")
        .inTable("messages")
        .onDelete("CASCADE");
    });
  }
}

export async function down(knex) {
  return knex.schema.dropTable("reactions");
}
