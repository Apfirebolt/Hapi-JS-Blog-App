const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/me',
  options: {
    tags: ['api', 'Profile Data'],
    handler: async (request) => {
      try {
        const currentUser = await UserModel.query().findById(request.app.userId);
        return currentUser;
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
