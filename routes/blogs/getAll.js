const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/{userId}/category',
  options: {
    tags: ['api', 'Create Blog Category'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User does not exist.');
        }
        else {
          // return fetchedUser.$relatedQuery('blog_categories').where((builder) => {
          //   builder.where('created_by', request.app.userId).andWhere('id', '>', 1);
          // });
          return fetchedUser.$relatedQuery('blog_categories');
        }
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
