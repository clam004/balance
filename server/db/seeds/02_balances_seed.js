const moment = require('moment');


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('balances').del()
    .then(function () {
      // Inserts seed entries
      return knex('balances').insert([
        {//id: 1, 
          title: 'Toro to install 4 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof ',
          buyer_obligation: 'For 4 solar panel installations',
          seller_obligation: 'To install 4 solar panels',
          buyer_name: 'Josh',
          seller_name: 'Toro',
          buyer_stake_amount: 1000.00,
          seller_stake_amount: 500.00, 
          balance_price: 4000.00,
          completed: false,
          agreement_confirmed:false,
          buyer_id: 1,
          seller_id: 2,
          created_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-11-01T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         },
        {//id: 2, 
          title: 'Toro to install 3 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof ',
          buyer_obligation: 'For 3 solar panel installations',
          seller_obligation: 'To install 3 solar panels',
          buyer_name: 'Josh',
          seller_name: 'Toro',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 1000.00,
          completed: false,
          agreement_confirmed:true,
          buyer_id: 1,
          seller_id: 2,
          created_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-02-01T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         },
        {//id: 3, 
          title: 'Alex buys food from Josh',
          balance_description: 'Alex buys yakitori from Josh',
          buyer_obligation: 'Josh cooks 5 yakitori for Alex',
          seller_obligation: 'Alex eats 5 yakitori from Josh',
          buyer_name: 'Alex',
          seller_name: 'Josh',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 1000.00,
          completed: true,
          agreement_confirmed:true,
          buyer_id: 3,
          seller_id: 1,
          created_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-11-01T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         }
      ]);
    });
};

/*
        {//id: 4, 
          title: 'Josh buys a game from Alex',
          balance_description: 'Josh buys a game from Alex, Alex makes a game',
          buyer_obligation: 'Josh gets a game',
          seller_obligation: 'Alex hands over game',
          buyer_name: 'Josh',
          seller_name: 'Alex',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 9000.00,
          completed: true,
          agreement_confirmed:true,
          buyer_id: 1,
          seller_id: 3,
          created_at: "2018-07-14 17:29:24.505-07",
          updated_at: "2018-08-14 17:29:24.505-07",
          due_date: "2018-08-14 17:29:24.505-07",
         }
*/
