
exports.up = function(knex, Promise) {
  return knex.schema.createTable('arbitration', table => {
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
    table.boolean('buyer_indicates_delivered').defaultTo(null);
    table.boolean('seller_indicates_delivered').defaultTo(null);
    table.boolean('buyer_approves_contract').defaultTo(null);
    table.boolean('seller_approves_contract').defaultTo(null);
    table.integer('buyer_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('seller_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.timestamp('created_at');
    table.timestamp('updated_at');
    table.timestamp('due_date');
    table.timestamp('completed_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('arbitration');
};
