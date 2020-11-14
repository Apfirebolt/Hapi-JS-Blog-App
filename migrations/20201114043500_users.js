exports.up = (knex) => knex.schema
  .createTable('users', (table) => {
    table.increments('id');
    table.string('first_name');
    table.string('last_name');
    table.string('email');
    table.string('password');
    table.boolean('is_active').default(true);
    table.boolean('is_deleted').default(false);
    table.boolean('is_verified').default(false);
    table.jsonb('settings');
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('users');
