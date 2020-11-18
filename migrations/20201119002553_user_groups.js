exports.up = (knex) => knex.schema
  .createTable('user_groups', (table) => {
    table.increments('id');
    table.integer('group_id').unsigned().references('id').inTable('groups')
      .notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users')
      .notNullable();
    table.jsonb('meta');
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('user_groups');
