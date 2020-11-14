
const knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../knexfile');

module.exports = Model.knex(knex(knexConfig));
