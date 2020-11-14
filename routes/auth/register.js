const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/auth/register',
  options: {
    tags: ['api', 'Auth', 'Register'],
    auth: false,
    validate: {
      payload: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().lowercase().email().required(),
        password: Joi.string().min(8).required(),
      }),
    },
    handler: async (request) => {
      try {
        // Check for user exists already exists by name
        const fetchedUser = await UserModel.query()
          .where('email', request.payload.email)
          .where('is_deleted', false)
          .first();
        if (fetchedUser) {
          return Boom.conflict('User with that email already exists');
        }
        const insertUserData = {
          first_name: request.payload.first_name,
          last_name: request.payload.last_name,
          email: request.payload.email,
          password: request.payload.password,
        };
        const insertedData = await UserModel.query().insert(insertUserData);     
        return {
          message: 'Data Posted Now.',
          data: insertedData
        };
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
