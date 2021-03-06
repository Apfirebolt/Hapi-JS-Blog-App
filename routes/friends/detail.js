const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');
const FriendModel = require('../../models/Friends');

module.exports = {
  method: 'GET',
  path: '/{userId}/friend/{requestId}',
  options: {
    tags: ['api', 'View Friend Request'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        requestId: Joi.number().required().label('Request ID'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.params.userId);
        if(!fetchedUser) {
            return Boom.notFound('User was not found.');
        }
        const fetchFriendModel = await FriendModel.query().findById(request.params.requestId);
        if(fetchFriendModel) {
            return fetchFriendModel;
        }
        return Boom.notFound('This request does not exist.');
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
