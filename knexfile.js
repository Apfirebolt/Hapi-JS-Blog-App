const Config = require('config');

const connection = {
  host: Config.db.host,
  user: Config.db.user,
  password: Config.db.password,
  database: Config.db.database,
  port: Config.db.port,
  ssl: Config.db.ssl,
};

// require('dotenv').config();

// const connection = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: (process.env.DB_SSL === 'true') ? { rejectUnauthorized: false } : false,
// };

module.exports = {
  client: 'pg',
  connection,
  pool: {
    min: 0,
    max: 20,
  },
  debug: (process.env.DEBUG_KNEX === 'true'),
  migrations: {
    tableName: 'knex_migrations',
  },
};
