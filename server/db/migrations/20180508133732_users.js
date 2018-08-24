exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('salt').notNullable();
    table.string('username');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
