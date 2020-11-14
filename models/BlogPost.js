const Path = require('path');
const BaseModel = require('./BaseModel');

class BlogPostModel extends BaseModel {
  static get tableName() {
    return 'blog_posts';
  }

  static get relationMappings() {
    return {
      post_comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: Path.join(__dirname, 'Comment'),
        join: {
          from: 'blog_post.id',
          to: 'comments.blog_post_id',
        },
      },
    };
  }
}

module.exports = BlogPostModel;
