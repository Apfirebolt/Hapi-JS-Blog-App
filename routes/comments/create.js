const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/{userId}/category/{categoryId}/posts/{postId}/comment',
  options: {
    tags: ['api', 'Create Post Comment'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
        postId: Joi.number().required().label('Post ID'),
      }),
      payload: Joi.object().keys({
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
            const blogPost = await fetchedBlog.$relatedQuery('posts').where({
                id: request.params.postId
            })
            .first();
            if(blogPost) {
                const insertData = {
                  content: request.payload.content,
                  author_id: request.app.userId
                }
                return blogPost.$relatedQuery('post_comments').insert(insertData);
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
