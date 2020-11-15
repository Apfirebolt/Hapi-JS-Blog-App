const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'PUT',
  path: '/{userId}/poll/{pollId}',
  options: {
    tags: ['api', 'Create Poll'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        pollId: Joi.number().required().label('Poll ID'),
      }),
      payload: Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.object().keys({
            answer: Joi.string().required(),
          })).min(1).required(),
      }),
    },
    handler: async (request) => {
      try {
        const pollOwner = await UserModel.query().findById(request.app.userId);
        const pollObject = await pollOwner.$relatedQuery('polls').findById(request.params.pollId);
        if (!pollObject) {
          return Boom.conflict('This poll does not exist.');
        }
        else {
            const updatedPayload = {
                question: request.payload.question,
                options: request.payload.options,
                created_by: request.app.userId,
            }
            const updatedData = await pollObject.$query().patch(updatedPayload);
            return {
                message: 'Poll was successfully updated.',
                data: updatedData
            }
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
