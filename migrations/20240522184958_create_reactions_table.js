export async function up(knex) {
  return knex.schema.createTable("reactions", function (table) {
    table.increments("id").primary();
    table.integer("message_id").unsigned().notNullable();
    table.boolean("user_like").defaultTo(false);
    table.boolean("user_love").defaultTo(false);
    table.boolean("user_haha").defaultTo(false);
    table.boolean("user_wow").defaultTo(false);
    table.boolean("user_sad").defaultTo(false);
    table.boolean("user_angry").defaultTo(false);
    table.boolean("agent_like").defaultTo(false);
    table.boolean("agent_love").defaultTo(false);
    table.boolean("agent_haha").defaultTo(false);
    table.boolean("agent_wow").defaultTo(false);
    table.boolean("agent_sad").defaultTo(false);
    table.boolean("agent_angry").defaultTo(false);
    table
      .foreign("message_id")
      .references("id")
      .inTable("messages")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  return knex.schema.dropTable("reactions");
}
