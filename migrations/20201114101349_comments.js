exports.up = (knex) => knex.schema
  .createTable('comments', (table) => {
    table.increments('id');
    table.integer('blog_post_id').unsigned().references('id').inTable('blog_posts');
    table.integer('author_id').unsigned().references('id').inTable('users');
    table.string('content');
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('comments');
