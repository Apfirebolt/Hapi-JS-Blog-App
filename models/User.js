const Path = require('path');
const Bcrypt = require('bcrypt');
const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('id', 'first_name', 'last_name', 'email');
      },
    };
  }

  static get relationMappings() {
    return {
      blog_categories: {
        relation: BaseModel.HasManyRelation,
        modelClass: Path.join(__dirname, 'BlogCategory'),
        join: {
          from: 'users.id',
          to: 'blog_category.created_by',
        },
      },
    };
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.password = await Bcrypt.hash(this.password, 8);
  }

  async $beforeUpdate(queryContext) {
    await super.$beforeUpdate({}, queryContext);
    if (this.password) {
      this.password = await Bcrypt.hash(this.password, 8);
    }
  }
}

module.exports = UserModel;
