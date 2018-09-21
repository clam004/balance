module.exports = {
  dev: {
    client: 'postgresql',
    connection: 'postgres://axonuakyjzsquy:240b535d06397d869b30b9fb2e8eedafe06d2ba6dfd90284342290e45338b6e8@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d902q0l08ldcqs',
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'postgresql',
    connection: 'postgres://axonuakyjzsquy:240b535d06397d869b30b9fb2e8eedafe06d2ba6dfd90284342290e45338b6e8@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d902q0l08ldcqs',
    pool: {
      min: 2,
      max: 10
    }
  },
  ssl: true
};
