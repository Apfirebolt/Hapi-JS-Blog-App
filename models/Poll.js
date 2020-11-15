const Path = require('path');
const BaseModel = require('./BaseModel');

class PollModel extends BaseModel {
  static get tableName() {
    return 'polls';
  }

  static get modifiers() {
  }

  static get relationMappings() {
    return {
      options: {
        relation: BaseModel.HasManyRelation,
        modelClass: Path.join(__dirname, 'Answer'),
        join: {
          from: 'polls.id',
          to: 'poll_answers.poll_id',
        },
      },   
    };
  }
}

module.exports = PollModel;
