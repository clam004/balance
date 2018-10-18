
exports.up = function(knex, Promise) {
  return knex.schema.createTable('history', table => {
    table.increments('id');
    table.integer('balance_id');
    table.string('title').notNullable();
    table.string('balance_description');
    table.string('buyer_obligation').notNullable();
    table.string('seller_obligation').notNullable();
    table.string('buyer_email');
    table.string('seller_email');
    table.decimal('buyer_stake_amount',20,2);
    table.decimal('seller_stake_amount',20,2);
    table.decimal('balance_price',20,2);
    table.boolean('completed').notNullable().defaultTo(true);
    table.boolean('agreement_confirmed').notNullable().defaultTo(true);
    table.integer('buyer_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('seller_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('due_date');
    table.timestamp('completed_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('history');
};
