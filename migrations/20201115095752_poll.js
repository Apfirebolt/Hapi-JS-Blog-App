exports.up = (knex) => knex.schema
  .createTable('polls', (table) => {
    table.increments('id');
    table.string('question');
    table.integer('created_by').unsigned().references('id').inTable('users')
      .notNullable();
    table.boolean('is_active').default(true);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('polls');
