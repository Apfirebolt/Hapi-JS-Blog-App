const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');
const FriendModel = require('../../models/Friends');

module.exports = {
  method: 'POST',
  path: '/{userId}/friend',
  options: {
    tags: ['api', 'Create Friend Request'],
    validate: {
      params: Joi.object().keys({
        userId: Joi.number().required().label('User ID'),
      }),
      payload: Joi.object().keys({
        user_to_id: Joi.number().required(),
      }),
    },
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.payload.user_to_id);
        if(!fetchedUser) {
            return Boom.notFound('User was not found.');
        }
        if(request.payload.user_to_id == request.app.userId) {
            return Boom.forbidden('You cannot send friend request to yourself.')
        }
        const insertData = {
            user_to_id: request.payload.user_to_id,
            user_from_id: request.app.userId,
            status: 'pending'
        };
        const doesFriendRequestExist = await FriendModel.query()
          .where('user_to_id', request.payload.user_to_id)
          .where('user_from_id', request.app.userId)
          .first();
        if(doesFriendRequestExist) {
          return Boom.conflict('This request object already exists.');
        }  
        const insertedFriendModel = await FriendModel.query().insertAndFetch(insertData);
        return {
            message: `Friend request was successfully sent to ${fetchedUser.first_name}.`,
            data: insertedFriendModel
        }
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
