const moment = require('moment');


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('balances').del()
    .then(function () {
      // Inserts seed entries
      return knex('balances').insert([
        { 
          title: 'Toro to install 4 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof ',
          buyer_obligation: 'For 4 solar panel installations',
          seller_obligation: 'To install 4 solar panels',
          buyer_email: 'Josh@balance.com',
          seller_email: 'Toro@balance.com',
          buyer_stake_amount: 1000.00,
          seller_stake_amount: 500.00, 
          balance_price: 4000.00,
          completed: false,
          buyer_confirmed:true,
          seller_confirmed:null,
          buyer_id: 1,
          seller_id: 2,
          created_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-10-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-11-01T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         },
        {
          title: 'Toro to install 3 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 3 solar panels on Josh’s roof ',
          buyer_obligation: 'For 3 solar panel installations',
          seller_obligation: 'To install 3 solar panels',
          buyer_email: 'Josh@balance.com',
          seller_email: 'Toro@balance.com',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 1000.00,
          completed: false,
          buyer_confirmed:true,
          seller_confirmed:null,
          buyer_id: 1,
          seller_id: 2,
          created_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-11-01T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         },
        {
          title: 'Toro to install 2 solar panels on Josh’s roof',
          balance_description: 'Toro the Solar Panel technian has agreed to install 2 solar panels on Josh’s roof ',
          buyer_obligation: 'For 2 solar panel installations',
          seller_obligation: 'To install 3 solar panels',
          buyer_email: 'Josh@balance.com',
          seller_email: 'Toro@balance.com',
          buyer_stake_amount: 8.00,
          seller_stake_amount: 3.00, 
          balance_price: 100.50,
          completed: true,
          buyer_confirmed:true,
          seller_confirmed:true,
          buyer_id: 1,
          seller_id: 2,
          created_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment("2018-01-01T05:06:07", "YYYY-MM-DDTHH:mm:ss"),
          due_date: moment("2018-12-10T05:06:07", "YYYY-MM-DDTHH:mm:ss")
         },
        {
          title: 'Alex buys food from Josh',
          balance_description: 'Alex buys yakitori from Josh',
          buyer_obligation: 'Josh cooks 5 yakitori for Alex',
          seller_obligation: 'Alex eats 5 yakitori from Josh',
          buyer_email: 'Alex@balance.com',
          seller_email: 'Josh@balance.com',
          buyer_stake_amount: 800.00,
          seller_stake_amount: 300.00, 
          balance_price: 1000.00,
          completed: true,
          buyer_confirmed:true,
          seller_confirmed:false,
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
