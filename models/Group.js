const Path = require('path');
const BaseModel = require('./BaseModel');

class GroupModel extends BaseModel {
  static get tableName() {
    return 'groups';
  }

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Path.join(__dirname, 'User'),
        join: {
          from: 'groups.id',
          through: {
            from: 'user_groups.group_id',
            to: 'user_groups.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = GroupModel;
