const BaseModel = require('./BaseModel');

class CommentModel extends BaseModel {
  static get tableName() {
    return 'comment';
  }
}

module.exports = CommentModel;
