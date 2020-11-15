const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/{userId}/poll',
  options: {
    tags: ['api', 'All User Polls'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        const fetchedPolls = await fetchedUser.$relatedQuery('polls')
            .withGraphFetched('options');
        return fetchedPolls;
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
