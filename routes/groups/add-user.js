const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const GroupModel = require('../../models/Group');

module.exports = {
  method: 'POST',
  path: '/groups/{groupId}/add',
  options: {
    tags: ['api', 'Add Member to a group'],
    validate: {
      params: Joi.object().keys({
        groupId: Joi.number().required(),
      }),    
      payload: Joi.object().keys({
        userId: Joi.number().required(),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedGroup = await GroupModel.query().findById(request.params.groupId);
        if (!fetchedGroup) {
            return Boom.notFound('Group does not exist.');
        }
        const insertedData = await fetchedGroup.$relatedQuery('users').relate(request.payload.userId);
        return insertedData;
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
