const BaseModel = require('./BaseModel');

class CommentModel extends BaseModel {
  static get tableName() {
    return 'comments';
  }
}

module.exports = CommentModel;
