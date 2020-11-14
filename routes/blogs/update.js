const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'PUT',
  path: '/{userId}/category/{categoryId}',
  options: {
    tags: ['api', 'Create Blog Category'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
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
        })
        .whereNot('id', request.params.categoryId)
        .first();
        if (blogAlreadyExists) {
          return Boom.conflict('This category name already exists.');
        }
        else {
            const insertedData = await fetchedUser.$relatedQuery('blog_categories')
            .where('id', request.params.categoryId)
            .patch(request.payload);
            return {
                message: 'Blog Category was successfully updated.',
                data: insertedData
            }
        }
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
