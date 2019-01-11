
exports.up = function(knex, Promise) {
  return knex.schema.createTable('balances', table => {
    table.increments('id');
    table.string('state_string');
    table.integer('state_integer');
    table.integer('proposer_id').references('id').inTable('users').onDelete('cascade');
    table.string('buyer_email');
    table.string('seller_email');
    table.string('title');
    table.boolean('buyer_approves_contract').defaultTo(null);
    table.boolean('seller_approves_contract').defaultTo(null);
    table.timestamp('due_date');
    table.boolean('buyer_indicates_delivered').defaultTo(null);
    table.boolean('seller_indicates_delivered').defaultTo(null);
    table.string('balance_description');
    table.string('buyer_obligation');
    table.string('seller_obligation');
    table.decimal('balance_price',20,2);
    table.integer('buyer_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('seller_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('duration');
    table.string('duration_units');
    table.string('title_prelim');
    table.string('balance_description_prelim');
    table.string('buyer_obligation_prelim');
    table.string('seller_obligation_prelim');
    table.decimal('balance_price_prelim',20,2);
    table.integer('duration_prelim');
    table.string('duration_units_prelim');
    table.timestamp('due_date_prelim');
    table.decimal('buyer_stake_amount',20,2);
    table.decimal('seller_stake_amount',20,2); 
    table.decimal('buyer_stake_amount_prelim',20,2);
    table.decimal('seller_stake_amount_prelim',20,2); 
    table.timestamp('created_at');
    table.timestamp('updated_at');
    table.timestamp('completed_date').defaultTo(null);

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('balances');
};

