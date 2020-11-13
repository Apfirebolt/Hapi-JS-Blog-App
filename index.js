process.env.TZ = 'UTC';
require('make-promises-safe');
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const HapiPino = require('hapi-pino');
const HapiAutoRoutes = require('hapi-auto-routes');
const HapiAuthJwt = require('hapi-auth-jwt2');
require('./utils/db');
const User = require('./models/User');

const server = Hapi.server({
  port: 9000,
  routes: {
    validate: {
      options: {
        stripUnknown: true,
      },
      failAction: async (request, h, err) => h
        .response({ statusCode: 400, message: err.details[0].message, error: 'Validation Error' })
        .code(400)
        .takeover(),
    },
  },
});

const init = async () => {
  await server.register({
    plugin: HapiPino,
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      logRequestComplete: false,
    },
  });
  await server.register({
    plugin: HapiAuthJwt,
  });
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    verifyOptions: { algorithms: ['HS256'] },
    async validate(decoded, request) {
      const fetchedUser = await User.query().withGraphFetched('org').findById(decoded.id);
      if (fetchedUser) {
        if (request.params && request.params.orgId) {
          if (request.params.orgId !== fetchedUser.org.id.toString()) {
            return { isValid: false };
          }
        }
        request.app.orgId = fetchedUser.org.id;
        request.app.userId = fetchedUser.id;
        return { isValid: true, credentials: fetchedUser };
      }
      return { isValid: false };
    },
  });
  server.auth.default('jwt');
  HapiAutoRoutes.bind(server).register({
    pattern: `${__dirname}/routes/**/*.js`,
  });
  await server.start();
  server.log(['system', 'info'], `Server started ${server.info.uri}`);
};

init();

process.on('SIGINT', () => {
  server.log(['system', 'info'], 'stopping server...');
  server.stop({ timeout: 10000 }).then((err) => {
    server.log(['system', 'info'], 'server stopped');
    process.exit((err) ? 1 : 0);
  });
});
