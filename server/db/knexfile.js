module.exports = {
  dev: {
    client: 'postgresql',
    connection: {
      port: process.env.BALANCE_DB_PORT,
      host: process.env.BALANCE_DB_HOST,
      database: process.env.BALANCE_DB_NAME,
      user: process.env.BALANCE_DB_USER,
      password: process.env.BALANCE_DB_PW
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL ? process.env.DATABASE_URL : {
      port: process.env.BALANCE_DB_PORT_PROD,
      host: process.env.BALANCE_DB_HOST_PROD,
      database: process.env.BALANCE_DB_NAME_PROD,
      user: process.env.BALANCE_DB_USER_PROD,
      password: process.env.BALANCE_DB_PW_PROD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds'
    }
  }
};
