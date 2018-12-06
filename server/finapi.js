const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const { users } = require('./db/controllers');

const finapi = Router();
finapi.use(require("body-parser").text());

const env = process.env.NODE_ENV || 'dev';
const config = require('./db/knexfile.js')[env];
const knex = require('knex')(config);
const moment = require('moment');


const { PLAID_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, PLAID_CLIENT_ID, PLAID_SECRET } = require('../spldconfig');

console.log('finapi PLAID_CLIENT_ID', PLAID_CLIENT_ID);
console.log('finapi PLAID_PUBLISHABLE_KEY', PLAID_PUBLISHABLE_KEY);
console.log('finapi PLAID_SECRET', PLAID_SECRET);
console.log('finapi STRIPE_SECRET_KEY', STRIPE_SECRET_KEY);

const stripe = require("stripe")(STRIPE_SECRET_KEY);

var plaid = require('plaid');

var plaidClient = new plaid.Client(PLAID_CLIENT_ID,
                                   PLAID_SECRET ,
                                   PLAID_PUBLISHABLE_KEY,
                                   plaid.environments.sandbox);
                                   //plaid.environments.development);

finapi.post('/test_payment_api', (req, response, next) => {
 
	//console.log('get_bank_acnt_tok', req.body);
	//response.json(req.body);

	stripe.charges.create({

	  amount: 200, // this is written in cents
	  //application_fee: 
	  currency: "usd",
	  description: "test_1a",
	  customer: 'cus_E0uJKIVOSctO2D',//'cus_DzdWJ1qDZm1poy', // Plaid generated customer ID
	  //source: 'btok_1DY0gOFe8nlPJCfgaMHEKUii',

	  destination: {
	      amount: 100,
	      account: 'acct_1DYsSBHb2WoeqvJO', //{CONNECTED_STRIPE_ACCOUNT_ID},
      },

	}, (err, charge) => {
		console.log('charge success: ', charge)
		console.log('err', err)
		response.json(charge);
	});

    /*
	console.log('store_plaid_customer_id',req.body);

	var PLAID_LINK_PUBLIC_TOKEN = req.body.plaid_token;
	var ACCOUNT_ID = req.body.account_ID;
	//var USER_ID = req.user.id;

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  var accessToken = res.access_token;
	  console.log('accessToken', accessToken)

	  	plaidClient.createStripeToken(accessToken, ACCOUNT_ID, function(err, res) {

	  		bankAccountToken = res.stripe_bank_account_token;

	  		console.log('bankAccountToken', bankAccountToken)
	  		response.json({'bankAccountToken':bankAccountToken})

			stripe.customers.create({

			  	source: bankAccountToken,
			  	description: USER_ID

			  },(customer_err, customer) => {

				customer_id = customer.id;

	        });
	    });
	});
       */ 

});

finapi.post('/buyer_pay_seller', (req, res, next) => {

    console.log('/buyer_pay_seller', req.body);

	let buyer_id = req.body.balance.buyer_id;
	let seller_id = req.body.balance.seller_id;

	let action_id;
	let buyer_customer_id;
	let seller_acnt_tok;

    knex('actions')
    .insert({
    	user_id1:buyer_id,
    	user_id2:seller_id,
    	action_time1:moment().format("YYYY-MM-DDTHH:mm:ss"),
    	action_string1:'buyer to seller payment for delivered balance in USD',
    	action_int1:req.body.balance.id,
    	action_decimal1:req.body.balance.balance_price,
    })
 	.returning('id')
	.then((id) => {

	    action_id = id[0]; //res.json({id:id[0]})

		knex('users').select(['stripe_customer_id'])
		.where('id',buyer_id)
		.then(buyer_info => {

	        buyer_customer_id = buyer_info[0].stripe_customer_id;

			knex('users').select(['stripe_connect_account_token'])
		    .where('id',seller_id)
		    .then(seller_info => {

		    	seller_acnt_tok = seller_info[0].stripe_connect_account_token;

		    	let balance_price = req.body.balance.balance_price;
		    	let balance_price_cents = balance_price * 100;

		    	console.log('balance_price_cents, seller_acnt_tok, buyer_customer_id', balance_price_cents, seller_acnt_tok, buyer_customer_id);

	 			let charge_amount = Math.round(balance_price_cents * 1.005);
	 			let deposit_amount = Math.round(balance_price_cents * (1 - 0.005));
		    	
				stripe.charges.create({
					amount: charge_amount, // this is written in cents
					//application_fee: 
					currency: "usd",
					description: req.body.balance.title + " balance "+req.body.balance.id+" buyer "+buyer_id+" seller "+seller_id,
					customer: buyer_customer_id, // Plaid generated customer ID
					//source: buyer_stripe_connect_account_token,
					destination: {
						amount: deposit_amount,
						account: seller_acnt_tok, //{CONNECTED_STRIPE_ACCOUNT_ID},
				    },    
				}, (err, charge) => {
					console.log('SUCCESS! charge: ', charge)
					console.log('err', err)

					if (err) {
						
						knex('actions')
						.where('id', action_id)
						.update({
							action_string2:err.requestId,
						})
						.then((response) => {
							console.log('err',response)
						})
						res.json({response:err.message});
						//console.log("ERROR", err)

					} else {
						
						knex('actions')
						.where('id', action_id)
						.update({
							action_string2:charge.id,
						})
						.then((response) => {
							console.log('charge',response)
						})
						res.json({response:charge.balance_transaction});
						//console.log("SUCCESS", action_id, charge.id)
					}

				});
				
		    });
			
		});	

	});

});


finapi.post('/get_connect_data', (req, res, next) => {

	stripe.accounts.retrieve(
	  req.body.stripe_connect_account_token,
	  function(err, account) {
        //console.log("retreived account",account)
	    res.json({
	      "first_name":account.legal_entity.first_name,
		  "last_name":account.legal_entity.last_name,
		  "dob_day":account.legal_entity.dob.day,
		  "dob_month":account.legal_entity.dob.month,
		  "dob_year":account.legal_entity.dob.year,
		  "address_line1":account.legal_entity.address.line1,
		  "address_city":account.legal_entity.address.city,
		  "address_state":account.legal_entity.address.state,
		  "address_postal_code":account.legal_entity.address.postal_code,
		  "address_country":account.legal_entity.address.country,
	    })
	  }
	)
});

finapi.post('/store_plaid_customer_id', (req, response, next) => {

	console.log('store_plaid_customer_id',req.body);

	var PLAID_LINK_PUBLIC_TOKEN = req.body.plaid_token;
	var ACCOUNT_ID = req.body.account_ID;
	var USER_ID = req.user.id;
	var customer_id;

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  var accessToken = res.access_token;

	  	plaidClient.createStripeToken(accessToken, ACCOUNT_ID, function(err, res) {

	  		var bankAccountToken = res.stripe_bank_account_token;

			stripe.customers.create({

			  	source: bankAccountToken,
			  	description: USER_ID

			  },(customer_err, customer) => {

				customer_id = customer.id;

				if (customer_err) {
				  	response.json({"error":customer_err.Error})
				  } else {
					return knex('users')
					.where('id', USER_ID)
					.update({
						stripe_customer_id:customer_id,
					}).then(()=>{
					   	response.json({"success":true})
					})
				}
	        });
	    });
	});
});

finapi.post('/store_connect_account_token', (req, response, next) => {

	var PLAID_LINK_PUBLIC_TOKEN = req.body.plaid_token;
	var ACCOUNT_ID = req.body.account_ID;
	var USER_ID = req.user.id;
	var stripe_connect_account_token;
	var bankAccountToken;

	console.log(" PLAID_LINK_PUBLIC_TOKEN ", PLAID_LINK_PUBLIC_TOKEN, "ACCOUNT_ID", ACCOUNT_ID)
	console.log("connect account", req.body)

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  console.log('exchangePublicToken err', err)
	  console.log('res.access_token',res.access_token)
	  var accessToken = res.access_token;

	  // Generate a bank account token
	    plaidClient.createStripeToken(accessToken, ACCOUNT_ID, function(err, res) {

	    	bankAccountToken = res.stripe_bank_account_token;

			stripe.accounts.create({
		      
			  type: "custom",
			  //country: req.body.country,
			  email: req.body.user_email,
			  legal_entity: {
			  	type: "individual",
			  	first_name: req.body.first_name,
			  	last_name: req.body.last_name,

			    /*	
			  	address: {
			  		city: req.body.address_city,
			  		line1: req.body.address_line1,
			  		postal_code: req.body.address_postal_code,
			  		state: req.body.address_state,
			  	},
			  	dob: {
			  		day: req.body.dob_day,
			  		month: req.body.dob_month,
			  		year: req.body.dob_year,
			  	},
			  	*/
			  	//ssn_last_4: req.body.ssn_last_4,

			  },
			  tos_acceptance: {
			  	date: Math.round((new Date()).getTime() / 1000),
			  	ip: req.connection.remoteAddress,
			  }
			}, function(connect_error, connect_account) {

			    // asynchronously called
			    console.log('connect_account', connect_account)
			    console.log('connect_error', connect_error)

                if (connect_error) {
                	response.json(connect_error.message) 
                	//response.json("error", connect_error.Error) connect_error
                } else {

				    stripe_connect_account_token = connect_account.id;

					console.log('bankAccountToken', bankAccountToken)
					console.log('stripe_connect_account_token', stripe_connect_account_token)

					stripe.accounts.createExternalAccount(
					  stripe_connect_account_token,
					  { external_account: bankAccountToken },
					  function(bank_err, bank_account) {
					      // asynchronously called
						  console.log('bank_account', bank_account)
						  console.log('bank_err', bank_err)

						if (bank_err) {
						  	//response.json({"success":false})
						  	//response.json("error", bank_err.Error)
							response.json(bank_err)
						} else {

							return knex('users')
							.where('id', USER_ID)
							.update({
								stripe_connect_account_token:stripe_connect_account_token,
							}).then(()=>{
							   	response.json({"success":true})
							})

						}
						  
					  }
					)
			    }

			})		
	   });
	});

});



module.exports = finapi;

/*

finapi.post('/charge', (req, res, next) => {
	stripe.charges.create({
	  amount: 1000,
	  currency: "usd",
	  description: "Charge example",
	  //source: "tok_mastercard", // obtained with Stripe.js
	  customer: "cus_Dv7GbjYPCHWJpa",
	  destination: {
	  	account:'acct_1DTGBUL6dgTpR2cz',
	  	amount:800,
	  },
	  //application_fee:200,
	}, function(err, charge) {
	  // asynchronously called
	  console.log('charge', charge)
	  console.log('err', err)
	});
});


finapi.post('/addbank', (req, res, next) => {

	stripe.accounts.createExternalAccount(
	  "acct_1DTCarHvNqoHJXP5",
	  { external_account: "btok_1DTDWdFe8nlPJCfgXljoMPGO" },
	  function(err, bank_account) {
	    // asynchronously called
		  console.log('bank_account', bank_account)
		  console.log('err', err)
	  }
	);

});


finapi.post('/updateaccount', (req, res, next) => {
	stripe.accounts.update("acct_1DTCarHvNqoHJXP5", {
	  support_phone: "555-867-5309"
	}, function(err, account) {
	  // asynchronously called
	  console.log('account', account)
	  console.log('err', err)
	});
});

finapi.post("/stripe_customer_id", async (req, res) => {

	console.log(req.body)

    stripe.customers.create({
	  source: req.body.token_id,
	  email: req.user.email,
    }, function(customer_err, customer) {

    	console.log('customer_err', customer_err);
    	console.log('customer', customer);

		if (customer_err) {
		  	response.json({"error":customer_err.Error})
		} else {
			return knex('users')
			.where('id',req.user.id)
			.update({
				stripe_customer_id:customer.id,
			}).then(()=>{
			   	res.json({"success":true})
			})
		}
	});
});

    const customer = await stripe.customers.create({
      source: req.body.token_id,
      email: req.user.email,
    })
    .then((err, ))

    console.log('customer.id', customer.id)

	return knex('users')
	.where('id', req.user.id)
	.update({
		stripe_customer_id:customer.id,
	}).then((output)=> {
		res.json(output);
	});


  // Charge the Customer instead of the card:
  const charge1 = await stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    customer: customer.id,
  })
  .then(res => {console.log("CHARGE RESPONSE",res)})

  
  const charge2 = await stripe.charges.create({
    amount: 2000,
    currency: 'usd',
    customer: customer.id,
  })
  .then(res2 => {console.log("CHARGE RESPONSE",res2)})

	  stripe.customers.create({
		  source: bankAccountToken,
		  description: "stripe_bank_account_customer_id"
	    }, function(err, customer) {
	    	console.log('customer_err', err);
	    	console.log('customer', customer);
			customer_id = customer.id;
		});


		console.log("accessToken", accessToken)
		console.log("bankAccountToken", bankAccountToken)
		console.log("customer_id", customer_id)

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  //console.log("res", res)

	  //var accessToken = res.access_token;

	  // Generate a bank account token

	  plaidClient.createStripeToken(accessToken, '{ACCOUNT_ID}', function(err, res) {
	    var bankAccountToken = res.stripe_bank_account_token;
	  });


	});

	Body raw Json 

	{
	"email" : "chloe@world.com",
	"country": "US",
	"stripe_account_type":"custom",
	"legal_entity_type":"individual",
	"legal_entity_first_name":"Chloe",
	"legal_entity_last_name":"Lam",
	"legal_entity_address_city":"San Francisco",
	"legal_entity_dob_day":30,
	"legal_entity_dob_month":5,
	"legal_entity_dob_year":1985,
	"legal_entity_ssn_last_4":1231,
	"legal_entity_tos_acceptance_ip":"209.37.114.33"
}


finapi.post('/store_plaid_token', (req, response, next) => {

	var PLAID_LINK_PUBLIC_TOKEN = req.body.plaid_token;
	var ACCOUNT_ID = req.body.account_ID;
	var USER_ID = req.user.id;
	var accessToken;
	var bankAccountToken;
	var customer_id;

	//console.log(" PLAID_LINK_PUBLIC_TOKEN ", PLAID_LINK_PUBLIC_TOKEN, "ACCOUNT_ID", ACCOUNT_ID)
    console.log("ACCOUNT_ID", ACCOUNT_ID)

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  accessToken = res.access_token;

	  // Generate a bank account token
	    plaidClient.createStripeToken(accessToken, ACCOUNT_ID, function(err, res) {

	    	bankAccountToken = res.stripe_bank_account_token;

	    	console.log('bankAccountToken', bankAccountToken)
	    	// a Stripe bank account token can be then be used to move money via Stripe's ACH API.
	    	// a verified Stripe bank account token ID. You can attach this token to a Stripe Customer object
            
			stripe.customers.create({
			  source: bankAccountToken,
			  description: "stripe_bank_account_customer_id"
			}, function(err, customer) {

				customer_id = customer.id;

				return knex('users')
				.where('id', USER_ID)
				.update({
					plaid_token:PLAID_LINK_PUBLIC_TOKEN,
					stripe_bank_account_token:bankAccountToken,
					stripe_customer_id:customer_id,
				}).then((output)=> {

					response.json(output);
					
					stripe.charges.create({
					  amount: 1500, // this is written in cents
					  currency: "usd",
					  description: "Example charge",
					  customer: customer_id,
					  destination: {
					      amount: 1000,
					      account: 'btok_1DSya5Fe8nlPJCfg471YmtGo',//{CONNECTED_STRIPE_ACCOUNT_ID},
				      },
					}, function(err, charge) {
						console.log('charge', charge)
						console.log('err', err)
					});
					
				});
			});
			
	   });
	});
});




			stripe.customers.create({
			  source: bankAccountToken,
			  description: "stripe_bank_account_customer_id"
			}, function(err, customer) {

				customer_id = customer.id;

				return knex('users')
				.where('id', USER_ID)
				.update({
					stripe_connect_account_token:stripe_connect_account_token,
					//stripe_bank_account_token:bankAccountToken,
					stripe_customer_id:customer_id,
				}).then((output)=> {

					response.json(output);
					
				});
			});



finapi.post('/store_customer_id', (req, response, next) => {

	var PLAID_LINK_PUBLIC_TOKEN = req.body.plaid_token;
	var ACCOUNT_ID = req.body.account_ID;
	var USER_ID = req.user.id;
	var bankAccountToken;
	var customer_id;

	//console.log(" PLAID_LINK_PUBLIC_TOKEN ", PLAID_LINK_PUBLIC_TOKEN, "ACCOUNT_ID", ACCOUNT_ID)

	plaidClient.exchangePublicToken(PLAID_LINK_PUBLIC_TOKEN, function(err, res) {

	  accessToken = res.access_token;

	  // Generate a bank account token
	    plaidClient.createStripeToken(accessToken, ACCOUNT_ID, function(err, res) {

	    	bankAccountToken = res.stripe_bank_account_token;

		    stripe.customers.create({
			  source: bankAccountToken,
			  description: "stripe_bank_account_customer_id"
		    }, function(err, customer) {
		    	console.log('customer_err', err);
		    	console.log('customer', customer);
				customer_id = customer.id;

				if (err) {
				  	response.json({"success":false})
				} else {
					return knex('users')
					.where('id', USER_ID)
					.update({
						stripe_customer_id:customer_id,
					}).then(()=>{
					   	response.json({"success":true})
					})
				}

			});	
	   });
	});

});


finapi.post('/createaccount', (req, res, next) => {

	stripe.accounts.create({
      
      //managed:true,
	  type: req.body.stripe_account_type,
	  country: req.body.country,
	  email: req.body.email,
	  legal_entity: {
	  	type: req.body.legal_entity_type,
	  	first_name: req.body.legal_entity_first_name,
	  	last_name: req.body.legal_entity_last_name,
	  	address: {
	  		city: req.body.legal_entity_address_city,
	  	},
	  	dob: {
	  		day: req.body.legal_entity_dob_day,
	  		month: req.body.legal_entity_dob_month,
	  		year: req.body.legal_entity_dob_year,
	  	},
	  	ssn_last_4: req.body.legal_entity_ssn_last_4,

	  },
	  tos_acceptance: {
	  	date: Math.round((new Date()).getTime() / 1000),
	  	ip: req.body.legal_entity_tos_acceptance_ip,
	  }
	}, function(err, account) {
	  // asynchronously called
	  console.log('account', account)
	  console.log('err', err)
	});

})


*/
