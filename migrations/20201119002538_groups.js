exports.up = (knex) => knex.schema
  .createTable('groups', (table) => {
    table.increments('id');
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.string('name');
    table.text('description');
    table.boolean('is_deleted').default(false);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('groups');
