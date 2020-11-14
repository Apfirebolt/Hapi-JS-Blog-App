const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/users',
  options: {
    tags: ['api', 'All Users'],
    auth: false,
    handler: async (request) => {
      try {
        const fetchedUsers = await UserModel.query();
        return fetchedUsers;
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
