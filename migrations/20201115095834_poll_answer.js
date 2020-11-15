exports.up = (knex) => knex.schema
  .createTable('poll_answers', (table) => {
    table.increments('id');
    table.string('answer');
    table.integer('poll_id').unsigned().references('id').inTable('polls')
      .notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('poll_answers');
