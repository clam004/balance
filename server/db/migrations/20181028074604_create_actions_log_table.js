
exports.up = function(knex, Promise) {
  return knex.schema.createTable('actions', table => {
    table.increments('id');
    table.integer('user_id1');
    table.integer('user_id2');
    table.timestamp('action_time1');
    table.timestamp('action_time2');
    table.string('action_string1');
    table.string('action_string2');     
    table.decimal('action_decimal1',20,2);
    table.decimal('action_decimal2',20,2);
    table.integer('action_int1');
    table.integer('action_int2');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('actions');
};