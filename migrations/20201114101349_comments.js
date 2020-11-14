exports.up = (knex) => knex.schema
  .createTable('comments', (table) => {
    table.increments('id');
    table.integer('blog_post_id').unsigned().references('id').inTable('blog_posts')
      .notNullable();
    table.integer('author_id').unsigned().references('id').inTable('users')
      .notNullable();
    table.string('content');
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('comments');
