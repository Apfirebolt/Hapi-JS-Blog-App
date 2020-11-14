const BaseModel = require('./BaseModel');

class FriendsModel extends BaseModel {
  static get tableName() {
    return 'friends';
  }
}

module.exports = FriendsModel;
