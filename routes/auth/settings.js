const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/settings',
  options: {
    tags: ['api', 'Settings'],
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().select('id', 'settings').findById(request.app.userId);
        return fetchedUser;
      } catch (err) {
        return Boom.notFound('Some error occured');
      }
    },
  },
};
