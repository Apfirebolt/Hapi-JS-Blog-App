const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');
const FriendModel = require('../../models/Friends');

module.exports = {
  method: 'PUT',
  path: '/{userId}/friend/{requestId}',
  options: {
    tags: ['api', 'Update Friend Request'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
        requestId: Joi.number().required().label('Request ID'),
      }),
      payload: Joi.object().keys({
        user_to_id: Joi.number().required(),
        status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.payload.user_to_id);
        if(!fetchedUser) {
            return Boom.notFound('User was not found.');
        }
        if(request.payload.user_to_id === request.app.userId) {
            return Boom.forbidden('You cannot send friend request to yourself.')
        }
        const updatedData = {
            user_to_id: request.payload.user_to_id,
            user_from_id: request.app.userId,
            status: request.payload.status
        };
        const fetchFriendModel = await FriendModel.query().findById(request.params.requestId);
        if(fetchFriendModel) {
            await fetchFriendModel.$query().patch(updatedData);
            return {
                message: `Friend request to ${fetchedUser.first_name} was successfully updated.`,
            }
        }
        return Boom.notFound('This request does not exist.');
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
