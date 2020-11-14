const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'DELETE',
  path: '/{userId}/category/{categoryId}',
  options: {
    tags: ['api', 'Delete Blog Category'],
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
        else {
            const fetchedBlogCategory = await fetchedUser.$relatedQuery('blog_categories')
                .where('id', request.params.categoryId)
                .delete();
            return fetchedBlogCategory;
        }
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
