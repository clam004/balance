
exports.up = function(knex, Promise) {
  return knex.schema.createTable('actions', table => {
    table.increments('id');
    table.integer('user_id');
    table.string('table_changed');
    table.integer('id_row_changed');
    table.string('column_changed');
    table.timestamp('time_changed').defaultTo(knex.fn.now());
    table.string('string_before');
    table.string('string_after');
    table.decimal('decimal_before',20,2);
    table.decimal('decimal_after',20,2);
    table.decimal('balance_price',20,2);
    table.boolean('boolean_before');
    table.boolean('boolean_after');
    table.integer('integer_before');
    table.integer('integer_after');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('actions');
};