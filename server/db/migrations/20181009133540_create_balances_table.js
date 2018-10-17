
exports.up = function(knex, Promise) {
  return knex.schema.createTable('balances', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.string('balance_description');
    table.string('buyer_obligation').notNullable();
    table.string('seller_obligation').notNullable();
    table.string('buyer_name').notNullable();
    table.string('seller_name').notNullable();
    table.decimal('buyer_stake_amount',20,2);
    table.decimal('seller_stake_amount',20,2);
    table.decimal('balance_price',20,2);
    table.boolean('completed').notNullable().defaultTo(false);
    table.boolean('agreement_confirmed').notNullable().defaultTo(false);
    table.integer('buyer_id').references('id').inTable('users').onDelete('cascade');
    table.integer('seller_id').references('id').inTable('users').onDelete('cascade');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('due_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('balances');
};
