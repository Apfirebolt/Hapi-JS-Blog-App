const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');


module.exports = {
  method: 'GET',
  path: '/{userId}/category/{categoryId}/posts/{postId}/all_comments',
  options: {
    tags: ['api', 'Create Post Comment'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
        postId: Joi.number().required().label('Post ID'),
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
            const blogPost = await fetchedBlog.$relatedQuery('posts').where({
                id: request.params.postId
            })
            .first();
            if(blogPost) {
                const allComments = await blogPost.$relatedQuery('post_comments');
                return allComments;
            }
            else {
                return Boom.notFound('Blog post was not found.');
            }
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
