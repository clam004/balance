
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('balances').del()
    .then(function () {
      // Inserts seed entries
      return knex('balances').insert([
        {id: 1, 
          title: 'Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof ',
          buyer_expectation: 'For 4 solar panel installations',
          seller_deliverable: 'To install 4 solar panels',
          buyer_name: 'Josh',
          seller_name: 'Toro',
          buyer_stake_amount: 1000.00,
          seller_stake_amount: 500.00, 
          balance_price: 4000.00,
          completed: false,
          buyer_id: 1,
          seller_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
          due_date: new Date()
         },
        {id: 2, 
          title: 'Toro the Solar Panel technician has agreed to install 3 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof ',
          buyer_expectation: 'For 3 solar panel installations',
          seller_deliverable: 'To install 3 solar panels',
          buyer_name: 'Josh',
          seller_name: 'Toro',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 1000.00,
          completed: false,
          buyer_id: 1,
          seller_id: 2,
          created_at: "2018-09-14 17:29:24.505-07",
          updated_at: new Date(),
          due_date: new Date()
         }
      ]);
    });
};
