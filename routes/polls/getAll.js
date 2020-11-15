const Boom = require('@hapi/boom');
const PollModel = require('../../models/Poll');

module.exports = {
  method: 'GET',
  path: '/polls',
  options: {
    tags: ['api', 'All Polls'],
    handler: async (request) => {
      try {
        const fetchedPolls = await PollModel.query().withGraphFetched('options');
        return fetchedPolls;
      } catch (err) {
        request.log(['error', 'database'], err);
        return Boom.internal();
      }
    },
  },
};
