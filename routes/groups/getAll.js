const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/groups',
  options: {
    tags: ['api', 'All Groups Detail'],
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.app.userId);
        return fetchedUser.$relatedQuery('groups');
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
