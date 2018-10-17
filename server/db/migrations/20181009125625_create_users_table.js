
exports.up = (knex, Promise) => {

  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('salt').notNullable();
    table.string('username');
    table.integer('num_completed_balances').defaultTo(0);
  })
  
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
