exports.up = (knex) => knex.schema
  .createTable('poll_voters', (table) => {
    table.increments('id');
    table.integer('answer_id').unsigned().references('id').inTable('poll_answers')
      .notNullable();
    table.integer('poll_id').unsigned().references('id').inTable('polls')
      .notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users')
      .notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('poll_voters');
