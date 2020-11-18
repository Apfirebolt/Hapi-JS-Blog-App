const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/Group');

module.exports = {
  method: 'PUT',
  path: '/groups/{groupId}',
  options: {
    tags: ['api', 'Edit a group'],
    validate: {
      params: Joi.object().keys({
        groupId: Joi.number().required(),
      }),
      payload: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.app.userId);
        const fetchedGroup = await fetchedUser.$relatedQuery('groups').findById(request.params.groupId)
        if (!fetchedGroup) {
          return Boom.conflict('Group does not exist.');
        }
        return fetchedGroup;
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
