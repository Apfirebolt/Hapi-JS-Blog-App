const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const UserModel = require('../../models/User');

module.exports = {
  method: 'POST',
  path: '/auth/login',
  options: {
    tags: ['api', 'Auth', 'Login'],
    auth: false,
    validate: {
      payload: Joi.object().keys({
        email: Joi.string().lowercase().email().required('Email'),
        password: Joi.string().required().label('Password'),
      }),
    },
    handler: async (request) => {
       // Check for the existence of users
       const fetchedUser = await UserModel.query()
       .where('is_deleted', false)
       .where('email', request.payload.email)
       .first();
       if (fetchedUser) {
         // Fetch user after verification
         const verified = await Bcrypt.compare(request.payload.password, fetchedUser.password);
           if (verified) {
             return {
               token: Jwt.sign({ id: fetchedUser.id }, process.env.JWT_SECRET),
             };
           }
         return Boom.unauthorized('Invalid email and password combination');
       }
       return Boom.notFound('User with this email does not exist.');
    },
  },
};
