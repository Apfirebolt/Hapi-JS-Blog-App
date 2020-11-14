const { Model } = require('objection');

class BaseModel extends Model {
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.created_at = new Date().toISOString();
  }

  async $beforeUpdate(context) {
    await super.$beforeUpdate({}, context);
    this.updated_at = new Date().toISOString();
  }
}

module.exports = BaseModel;
