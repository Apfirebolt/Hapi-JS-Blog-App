exports.up = (knex) => knex.schema
  .createTable('blog_category', (table) => {
    table.increments('id');
    table.integer('created_by').unsigned().references('id').inTable('users')
      .notNullable();
    table.string('name');
    table.string('description');
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('blog_category');
