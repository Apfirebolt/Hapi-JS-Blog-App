const BaseModel = require('./BaseModel');

class PollAnswerModel extends BaseModel {
  static get tableName() {
    return 'poll_answers';
  }
}

module.exports = PollAnswerModel;
