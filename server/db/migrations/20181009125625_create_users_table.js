
exports.up = (knex, Promise) => {

  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('salt').notNullable();
    table.string('username');
    table.integer('num_completed_balances').defaultTo(0);
    table.string('stripe_connect_account_token').defaultTo(null);
    //table.string('stripe_bank_account_token').defaultTo(null);
    table.string('stripe_customer_id').defaultTo(null);
  })
  
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
