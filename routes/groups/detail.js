const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const UserModel = require('../../models/User');

module.exports = {
  method: 'GET',
  path: '/groups/{groupId}',
  options: {
    tags: ['api', 'Group Detail'],
    handler: async (request) => {
      try {
        const fetchedUser = await UserModel.query().findById(request.app.userId);
        const fetchedGroup = await fetchedUser.$relatedQuery('groups')
            .withGraphFetched('users')
            .findById(request.params.groupId)
        if (!fetchedGroup) {
          return Boom.conflict('Group does not exist.');
        }
        return fetchedGroup;
      } catch (err) {
        request.log(['error', request.path], err);
        return Boom.internal();
      }
    },
  },
};
