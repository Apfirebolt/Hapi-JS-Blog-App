const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/{userId}/category/{categoryId}/posts',
  options: {
    tags: ['api', 'Get Blog Posts'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        const fetchedBlog = await fetchedUser.$relatedQuery('blog_categories').where({
          id: request.params.categoryId,
        }).first();
        if (!fetchedBlog) {
          return Boom.conflict('Blog category was not found.');
        }
        else {
            const blogPostData = await fetchedBlog.$relatedQuery('posts');
            return blogPostData;
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
