const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');


module.exports = {
  method: 'PUT',
  path: '/{userId}/category/{categoryId}/posts/{postId}/comment/{commentId}',
  options: {
    tags: ['api', 'Create Post Comment'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        categoryId: Joi.number().required().label('Category ID'),
        postId: Joi.number().required().label('Post ID'),
        commentId: Joi.number().required().label('Comment ID'),
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
                const updatedComment = await blogPost.$relatedQuery('post_comments')
                    .where('id', request.params.commentId)
                    .first()
                    .patch(request.payload)
                return updatedComment;
            }
            else {
                return Boom.notFound('Blog post or comment was not found.');
            }
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
