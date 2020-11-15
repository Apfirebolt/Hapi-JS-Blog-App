const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'DELETE',
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
        const fetchedUser = await UserModel.query().findById(request.app.userId);
        const fetchedPoll = await fetchedUser.$relatedQuery('polls').findById(request.params.pollId);
        if(fetchedPoll) {
            await fetchedPoll.$query().delete();
            return {
                message: 'The poll was successfully deleted.'
            };
        }
        return Boom.notFound('The poll does not exist.');
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
