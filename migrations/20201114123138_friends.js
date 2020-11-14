exports.up = (knex) => knex.schema
  .createTable('friends', (table) => {
    table.increments('id');
    table.integer('user_to_id').unsigned().references('id').inTable('users')
      .notNullable();
    table.integer('user_from_id').unsigned().references('id').inTable('users')
      .notNullable();
    table.string('status').notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('friends');
