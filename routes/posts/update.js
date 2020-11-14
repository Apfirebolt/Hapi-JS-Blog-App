const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'PUT',
  path: '/{userId}/category/{categoryId}/posts/{postId}',
  options: {
    tags: ['api', 'Update Blog Post'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
        postId: Joi.number().required().label('Post ID'),
      }),
      payload: Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
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
            const updatedData = await fetchedBlog.$relatedQuery('posts')
                .findById(request.params.postId)
                .patch(request.payload);
            return {
                message: 'Blog post was successfully updated.',
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
