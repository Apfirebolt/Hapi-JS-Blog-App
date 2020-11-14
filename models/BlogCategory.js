const BaseModel = require('./BaseModel');
const Path = require('path');

class BlogCategoryModel extends BaseModel {
  static get tableName() {
    return 'blog_category';
  }

  static get relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: Path.join(__dirname, 'BlogPost'),
        join: {
          from: 'blog_category.id',
          to: 'blog_posts.blog_category_id',
        },
      },
    };
  }
}



module.exports = BlogCategoryModel;
