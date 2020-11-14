const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/{userId}/category',
  options: {
    tags: ['api', 'Create Blog Category'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
      }),
      payload: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        const blogAlreadyExists = await fetchedUser.$relatedQuery('blog_categories').where({
          name: request.payload.name,
        }).first();
        if (blogAlreadyExists) {
          return Boom.conflict('This category already exists');
        }
        else {
            const insertedData = await fetchedUser.$relatedQuery('blog_categories').insert(request.payload);
            return {
                message: 'Blog Category was successfully created.',
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
