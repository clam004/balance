
const moment = require('moment');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('balances').del()
    .then(function () {
      // Inserts seed entries
      return knex('balances').insert([
        {
          title: 'Carson to Build App',
          state_string:'new',
          buyer_id: 5,
          seller_id: 6,
          proposer_id:5,
          buyer_email: 'Vicki@balance.com',
          seller_email: 'Carson@balance.com',
          buyer_stake_amount: 2.00,
          seller_stake_amount: 2.00, 
          balance_price: 4.00,
          balance_description: 'There is a 2 week learning period',
          buyer_obligation: 'Must provide specs and be available on twice weekly basis for at least 4 hours each ',
          seller_obligation: 'Build a website and make reasonable progress each week, breaks must be approved by Vicki, code must be commented well such that other programmers can learn within 1 week',
          buyer_indicates_delivered: false,
          seller_indicates_delivered: false,
          buyer_approves_contract:true,
          seller_approves_contract:null,
          duration:2,
          duration_units:'months',
          created_at: moment().subtract(1, 'months').format("YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
          due_date: moment().add(1, 'months').format("YYYY-MM-DDTHH:mm:ss"),
         },
        {
          title: 'Vicki to paint painting',
          state_string:'active',
          buyer_id: 6,
          seller_id: 5,
          proposer_id:6,
          buyer_email: 'Carson@balance.com',
          seller_email: 'Vicki@balance.com',
          buyer_stake_amount: 2.00,
          seller_stake_amount: 2.00, 
          balance_price: 4.00,
          balance_description: 'There is a 2 week discussion period',
          buyer_obligation: 'Must be available on a weekly basis for at least 10 minutes each ',
          seller_obligation: 'Paint Carson and Vicki on a scooter in San Francisco street, must have colors and velocity',
          buyer_indicates_delivered: false,
          seller_indicates_delivered: false,
          buyer_approves_contract:true,
          seller_approves_contract:true,
          duration:2,
          duration_units:'months',
          created_at: moment().subtract(1, 'months').format("YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
          due_date: moment().add(1, 'months').format("YYYY-MM-DDTHH:mm:ss"),
          title_prelim:'Painting by Vicki',
         },
        {
          title: 'Toro to install 2 solar panels on Josh’s roof',
          state_string:'active',
          buyer_id: 1,
          seller_id: 2,
          proposer_id: 1,
          buyer_email: 'Josh@balance.com',
          seller_email: 'Toro@balance.com',
          buyer_stake_amount: 2.00,
          seller_stake_amount: 1.00, 
          balance_price: 2.50,
          balance_description: 'Toro the Solar Panel technian has agreed to install 2 solar panels on Josh’s roof ',
          buyer_obligation: 'For 2 solar panel installations',
          seller_obligation: 'To install 3 solar panels',
          buyer_indicates_delivered: false,
          seller_indicates_delivered: true,
          buyer_approves_contract:true,
          seller_approves_contract:true,
          duration:2,
          duration_units:'days',
          created_at: moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment().subtract(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
          due_date: moment().add(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
         },
        {
          title: 'Alex buys food from Josh',
          state_string:'new',
          buyer_id: 3,
          seller_id: 1,
          proposer_id: 3,
          buyer_email: 'Alex@balance.com',
          seller_email: 'Josh@balance.com',
          buyer_stake_amount: 2.00,
          seller_stake_amount: 2.00, 
          balance_price: 4.00,
          balance_description: 'Alex buys yakitori from Josh',
          buyer_obligation: 'Josh cooks 5 yakitori for Alex',
          seller_obligation: 'Alex eats 5 yakitori from Josh',
          buyer_indicates_delivered: false,
          seller_indicates_delivered: false,
          buyer_approves_contract:true,
          seller_approves_contract:null,
          duration:2,
          duration_units:'days',
          created_at: moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
          updated_at: moment().subtract(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
          due_date: moment().add(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
         }
      ]);
    });
};

/*
  { 
    title: 'Toro to install 4 solar panels on Josh’s roof',
    state_string:'new',
    buyer_id: 1,
    seller_id: 2,
    proposer_id: 1,
    buyer_email: 'Josh@balance.com',
    seller_email: 'Toro@balance.com',
    buyer_stake_amount: 1.00,
    seller_stake_amount: 2.00, 
    balance_price: 4.00,
    balance_description: 'Toro the Solar Panel technian has agreed to install 4 solar panels on Josh’s roof ',
    buyer_obligation: 'For 4 solar panel installations',
    seller_obligation: 'To install 4 solar panels',
    buyer_indicates_delivered: false,
    seller_indicates_delivered: false,
    buyer_approves_contract:true,
    seller_approves_contract:null,
    duration:2,
    duration_units:'days',
    created_at: moment().subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
    updated_at: moment().subtract(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
    due_date: moment().add(1, 'days').format("YYYY-MM-DDTHH:mm:ss"),
   },
*/
