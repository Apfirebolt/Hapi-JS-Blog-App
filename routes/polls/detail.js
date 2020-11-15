const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/{userId}/poll/{pollId}',
  options: {
    tags: ['api', 'Poll Details'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        pollId: Joi.number().required().label('Poll ID'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        const fetchedPoll = await fetchedUser.$relatedQuery('polls').withGraphFetched('options')
            .findById(request.params.pollId);
        if(fetchedPoll) {
            return fetchedPoll;
        }
        return Boom.notFound('The roll does not exist.');
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
