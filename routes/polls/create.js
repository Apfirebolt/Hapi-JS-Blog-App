const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/{userId}/poll',
  options: {
    tags: ['api', 'Create Poll'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
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
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        const pollAlreadyExists = await fetchedUser.$relatedQuery('polls').where({
          question: request.payload.question,
        }).first();
        if (pollAlreadyExists) {
          return Boom.conflict('This poll already exists');
        }
        else {
            const payloadData = {
                question: request.payload.question,
                options: request.payload.options,
                created_by: request.app.userId,
            }
            const insertedData = await fetchedUser.$relatedQuery('polls').insertGraph(payloadData);
            return {
                message: 'Poll was successfully created.',
                data: insertedData
            }
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
