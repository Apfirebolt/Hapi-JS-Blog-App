exports.up = (knex) => knex.schema
  .createTable('blog_posts', (table) => {
    table.increments('id');
    table.integer('blog_category_id').unsigned().references('id').inTable('blog_category')
      .notNullable();
    table.string('title');
    table.string('content');
    table.boolean('is_shared').default(false);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('blog_posts');
