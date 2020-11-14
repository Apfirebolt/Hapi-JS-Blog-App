module.exports = {
    server: {
      port: 9000,
    },
    files: {
      maxSize: Number(process.env.FILES_MAXSIZE || 5),
    },
    jwt: {
      secret: 'super-secret',
    },
    db: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'pass12345',
      database: 'hapi_blog',
    },
  };
  