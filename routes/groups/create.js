const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/groups',
  options: {
    tags: ['api', 'Groups'],
    validate: {
      payload: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.app.userId);
        const fetchedGroup = await fetchedUser.$relatedQuery('groups').where({
          name: request.payload.name,
        }).first();
        if (fetchedGroup) {
          return Boom.conflict('Group with same name already exists');
        }
        if (fetchedUser) {
          await fetchedUser.$relatedQuery('groups').insert(request.payload);
          return {
              message: 'Group was successfully created.',
          };
        }
        return Boom.notFound('User not found');
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
