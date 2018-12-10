const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const { users } = require('./db/controllers');

const api = Router();

const env = process.env.NODE_ENV || 'dev';
const config = require('./db/knexfile.js')[env];
const knex = require('knex')(config);
const moment = require('moment');

const logout = (req, res) => {
  //console.log( req.user)
  req.logout(); 
  return res.status(200).send({ status: 200 });
};

api.all('/logout', logout);

api.post('/signup', users.signup);

api.post('/login', auth, users.login);

api.post('/get_user_data', (req, res, next) => {
	console.log('/get_user_data, req.user.id',req.user.id)

	if(req.isAuthenticated()) {
		knex('users').select(['id','email','username','num_completed_balances','stripe_connect_account_token','stripe_customer_id'])
		.where('id',req.user.id)
		.limit(1)
		.then(users => {
			res.json(users);
		});		
	}	
	
});



api.post('/approve_edit', (req, res, next) => {

	console.log('/approve_edit', req.body)

	knex('balances')
	.where({id:req.body.id})
	.update({
		state_string:req.body.state_string,
	 	title:req.body.title,
 		balance_description:req.body.balance_description,
 		buyer_obligation:req.body.buyer_obligation,
 		seller_obligation:req.body.seller_obligation,
 		balance_price:req.body.balance_price,
 		due_date:req.body.due_date,
		seller_approves_contract:true,
		buyer_approves_contract:true,
		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
	})
 	.then((response)=>{
 		console.log(response)
 	})
	 	
});

api.post('/archive_edit', (req, res, next) => {

	console.log('/archive_edit', req.body)

	knex('balances')
	.where({id:req.body.id})
	.update({
		state_string:req.body.state_string,
	})
 	.then(() => {
 		
	 	knex('balances')
	 	.insert({
	 		title:req.body.title,
	 		state_string:'rejected_edit_balance_id',
	 		state_integer:req.body.id,
	 		proposer_id:req.body.proposer_id,
	 		balance_description:req.body.balance_description,
	 		buyer_obligation:req.body.buyer_obligation,
	 		seller_obligation:req.body.seller_obligation,
	 		balance_price:req.body.balance_price,
	 		due_date:req.body.due_date,
	      	buyer_approves_contract:true,
	      	seller_approves_contract:false,
	 		buyer_id:req.body.buyer_id,
	 		seller_id:req.body.seller_id,
	 		created_at:req.body.updated_at,
	 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
	 	})
	 	.then((response)=>{
	 		console.log(response)
	 	})
	 	
 	})
});

// For testing
api.get('/ping', (req, res) => res.json({ message: 'pong'}));

api.post('/get_incomplete_balances_by_id', (req, res, next) => {

	console.log("/get_incomplete_balances_by_id ", req.user.id)

	const buyer_or_seller_id = req.body.buyer_or_seller_id;

 	if(req.isAuthenticated()) {

		knex('balances')
		.where(buyer_or_seller_id, req.user.id)
		.andWhere({completed_date:null})
		.andWhere(function() {
			this.where({state_string:'new'}).orWhere({state_string:'active'}).orWhere({state_string:'proposed_edit'})
		})
		.whereNot({state_string:'deleted'})
		.then(balances => {
			res.json(balances);
		});

	}	
});

api.post('/get_history', (req, res, next) => {

	console.log('/get_history', req.body)

 	if(req.isAuthenticated()) {

		knex('balances')
		.where(function() {
			this.where({buyer_id:req.user.id}).orWhere({seller_id:req.user.id})
		})
		.andWhere(function() {
			this.whereNotNull('completed_date').andWhere({state_string:'done'})		
		})
		.then(balances => {
			res.json(balances);
		});
		console.log("post get_user authenticated")
	}	
});

api.post('/get_arbitrations', (req, res, next) => {

	console.log('/get_arbitrations', req.body)

 	if(req.isAuthenticated()) {

		knex('balances')
		.where(function() {
			this.where({buyer_id:req.user.id}).orWhere({seller_id:req.user.id})
		})
		.andWhere(function() {
			this.where({state_string:'arbitrate'})
		})
		.then(balances => {
			res.json(balances);
		});
		console.log("post get_user authenticated")
	}	
});

api.post('/get_init_users', (req, res, next) => {

    console.log('/get_init_users, req.body', req.body)

	if(req.isAuthenticated()) {
 		console.log(req.body)
		knex('users').select(['id','email','username','num_completed_balances'])
		.whereNot('id',req.body.user_id)
		.limit(10)
		.then(users => {
			res.json(users);
		});		
	}	
	
});

api.post('/update_search_users', (req, res, next) => {
	if(req.isAuthenticated()) {
		console.log(req.body)
		var findlike = '%' + req.body.search_chars + '%'
		console.log(findlike)
		knex('users').select(['id','email','username','num_completed_balances'])
		.where('email', 'ilike', findlike)
		.whereNot('id',req.body.user_id)
		.limit(10)
		.then(users => {
			res.json(users);
		});
	}	
});

api.post('/update_balance', (req, res, next) => {

 	console.log(" data received ", req.body)
 	// milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years 
    var due_date = moment().add(req.body.agreement.duration, req.body.agreement.duration_units);

 	knex('balances')
 	.where('id',req.body.balance_id)
 	.update({
 		title:req.body.agreement.title,
 		balance_description:req.body.agreement.description,
 		buyer_obligation:req.body.agreement.buyer_obligation,
 		seller_obligation:req.body.agreement.seller_obligation,
 		buyer_email:req.body.buyer.email,
 		seller_email:req.body.seller.email,
      	buyer_indicates_delivered: false,
      	seller_indicates_delivered: false,
      	buyer_approves_contract:true,
      	seller_approves_contract:null,
 		buyer_id:req.user.id,
 		seller_id:req.body.seller.id,
 		buyer_stake_amount:req.body.buyer.stake,
 		seller_stake_amount:req.body.seller.stake,
 		balance_price:req.body.agreement.payment,
 		due_date:due_date,
 		duration:req.body.agreement.duration,
 		duration_units:req.body.agreement.duration_units,
 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 	})
 	.returning('id')
	.then((id) => {
	  res.json({id:id[0]})
	});
});

api.post('/submit_balance', (req, res, next) => {

 	console.log("/submit_balance", req.body)
 	// milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years 
 	var duration = req.body.agreement.duration;
 	var duration_units = req.body.agreement.duration_units;
 	// milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years 
    var due_date = moment().add(duration, duration_units).format("YYYY-MM-DDTHH:mm:ss");

    var buyer_approves_contract;
    var seller_approves_contract;

    if (req.user.id==req.body.buyer.id) {
	    buyer_approves_contract = true;
	    seller_approves_contract = null;
    } else if ((req.user.id==req.body.seller.id)) {
	    buyer_approves_contract = null;
	    seller_approves_contract = true;
    }
    
 	knex('balances')
 	.insert({
 		title:req.body.agreement.title,
 		state_string:'new',
 		proposer_id:req.user.id,
 		balance_description:req.body.agreement.description,
 		buyer_obligation:req.body.agreement.buyer_obligation,
 		seller_obligation:req.body.agreement.seller_obligation,
 		buyer_email:req.body.buyer.email,
 		seller_email:req.body.seller.email,
      	buyer_indicates_delivered: false,
      	seller_indicates_delivered: false,
      	buyer_approves_contract:buyer_approves_contract,
      	seller_approves_contract:seller_approves_contract,
 		buyer_id:req.body.buyer.id,
 		seller_id:req.body.seller.id,
 		buyer_stake_amount:req.body.buyer.stake,
 		seller_stake_amount:req.body.seller.stake,
 		balance_price:req.body.agreement.payment,
 		due_date:due_date,
 		duration:req.body.agreement.duration,
 		duration_units:req.body.agreement.duration_units,
 		created_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 	})
 	.returning('id')
	.then((id) => {
	  res.json({id:id[0]})
	});
    

});

api.post('/edit_balance', (req, res, next) => {

 	console.log("/edit_balance", req.body)
 	var duration = req.body.agreement.duration;
 	var duration_units = req.body.agreement.duration_units;
 	// milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years 
    var new_due_date = moment().add(duration, duration_units).format("YYYY-MM-DDTHH:mm:ss");

 	knex('balances')
 	.where('id',req.body.balance_id)
 	.update({
 		proposer_id:req.user.id,
 		state_string:"proposed_edit",
 		title_prelim:req.body.agreement.title,
 		balance_description_prelim:req.body.agreement.description,
 		buyer_obligation_prelim:req.body.agreement.buyer_obligation,
 		seller_obligation_prelim:req.body.agreement.seller_obligation,
 		balance_price_prelim:req.body.agreement.payment,
 		duration_prelim:req.body.agreement.duration,
 		duration_units_prelim:req.body.agreement.duration_units,
 		due_date_prelim:new_due_date,
 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 	})
 	.returning('id')
	.then((id) => {
	  res.json({id:id[0]})
	});
});

api.post('/balance_approve', (req, res, next) => {
	
	console.log("/balance_approve", req.body)

	var user_id = req.user.id;
	var status;

	if (user_id == req.body.seller_id) {

		console.log(status)

		knex('balances')
		.where('id',req.body.id)
		.update({
			state_string:"active",
			seller_approves_contract: true,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
		})
		.then(response => {console.log(response)});

	} else if (user_id == req.body.buyer_id) {

		console.log(status)

		knex('balances')
		.where('id',req.body.id)
		.update({
			state_string:"active",
			buyer_approves_contract: true,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
		})
		.then(response => {console.log(response)});
	}

	if (status == 'active') {
		knex('actions')
		.insert({
			user_id1:req.body.buyer_id,
			user_id2:req.body.seller_id,
			action_int1:req.body.id,
			action_string1:"activate balance",
			action_string2:req.body.title,
			action_time1:moment().format("YYYY-MM-DDTHH:mm:ss"),
		})	
		.then(response => {res.json(response)});
	}

});

api.post('/toggle_approve', (req, res, next) => {
	
	console.log("/toggle_approve", req.body)

	var user_id = req.user.id;
	var status;

	if (user_id == req.body.seller_id) {

		if (!req.body.seller_approves_contract && req.body.buyer_approves_contract) {
			status = 'active'
		} else {
			status = 'new'	
		}

		console.log(status)

		knex('balances')
		.where('id',req.body.id)
		.update({
			state_string:status,
			seller_approves_contract: !req.body.seller_approves_contract,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
		})
		.then(response => {console.log(response)});

	} else if (user_id == req.body.buyer_id) {

		if (!req.body.buyer_approves_contract && req.body.seller_approves_contract) {
			status = 'active'
		} else {
			status = 'new'
		}

		console.log(status)

		knex('balances')
		.where('id',req.body.id)
		.update({
			state_string:status,
			buyer_approves_contract: !req.body.buyer_approves_contract,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
		})
		.then(response => {console.log(response)});
	}

	if (status == 'active') {
		knex('actions')
		.insert({
			user_id1:req.body.buyer_id,
			user_id2:req.body.seller_id,
			action_int1:req.body.id,
			action_string1:"balances goes active",
			action_time1:moment().format("YYYY-MM-DDTHH:mm:ss"),
		})	
		.then(response => {res.json(response)});
	}

});

api.post('/toggle_complete', (req, res, next) => {

	console.log(" /toggle_complete ", req.body)

	if (req.body.seller_or_buyer == 'seller') {

		knex('balances')
		.where('id',req.body.id)
		.update({
			seller_indicates_delivered: !req.body.completed_boolean,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
		})
	    .then(response => {res.json(response)});

	} else if (req.body.seller_or_buyer == 'buyer') {

		knex('balances')
		.where('id',req.body.id)
		.update({
			buyer_indicates_delivered: !req.body.completed_boolean,
			updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
		})
		.then(response => {res.json(response)});

	}

});

api.post('/balance_done', (req, res, next) => {

	console.log("/balance_done", req.body)

 	knex('balances')
	.where('id',req.body.balance.id)
 	.update({
 		state_string:"done",
 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 		completed_date:moment().format("YYYY-MM-DDTHH:mm:ss")
 	})	
 	.then(() => {
 		knex('users')
 		.where('id',req.body.balance.buyer_id)
 		.increment('num_completed_balances', 1)
 		.then(res => {console.log('res1',res)})
 	})
 	.then(() => {
 		knex('users')
 		.where('id',req.body.balance.seller_id)
 		.increment('num_completed_balances', 1)
 		.then(res => {console.log('res2',res)})
 	})
 	
});


api.post('/arbitrate_balance', (req, res, next) => {

	console.log("/arbitrate_balance", req.body)

 	knex('balances')
	.where('id',req.body.balance.id)
 	.update({
 		state_string:"arbitrate",
 		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss"),
 	})	
 	.then(() => {
 		knex('users')
 		.where('id',req.body.balance.buyer_id)
 		.increment('num_arbitrated_balances', 1)
 		.then(res => {console.log('res1',res)})
 	})
 	.then(() => {
 		knex('users')
 		.where('id',req.body.balance.seller_id)
 		.increment('num_arbitrated_balances', 1)
 		.then(res => {console.log('res2',res)})
 	})
 	res.json({response:"moved to arbitration"});
});

api.post('/get_balance_data', (req, res, next) => {

	if(req.isAuthenticated()) {

 	console.log('/get_balance_data',req.body)

	knex('balances')
		.where('id',req.body.balance_id)
		.then(balance => {
			res.json(balance);
		});	
	}	
});

api.post('/balance_delete', (req, res, next) => {
	if(req.isAuthenticated()) {

	 	knex('balances')
		.where('id',req.body.id)
		.update({state_string:'deleted'})
		.then(response =>{
			console.log("delete", req.body.id, "response", response),
			res.json({success:response})
		})
	}
 });

api.post('/is_logged_in', (req, res, next) => {
	console.log('/is_logged_in', req.isAuthenticated())
	res.json({is_logged_in:req.isAuthenticated()})
 });

module.exports = api;


	/*

api.get('/balances/:id', (req,res)=>{
	if(req.isAuthenticated()) {
		knex('balances').where('buyer_id', req.params.id).orWhere('seller_id', req.params.id)
		.then(balances => {
		res.json(balances);
		console.log("authenticated")
		});
	} else {
		knex('balances').where('buyer_id', req.params.id).orWhere('seller_id', req.params.id)
		.then(balances => {
		res.json(balances);
		console.log("not authenticated")
		});
	}
});

const get_balances = (req, res, ) => {
	if (req.isAuthenticated()) {
		console.log("hi", req.user)
		knex('balances').where('buyer_id', req.body.user_id).orWhere('seller_id', req.body.user_id)
		.then(balances => {
			res.json(balances);
		});
	}
};


	req.session.cookie.id = req.params.id;
    res.send(req.isAuthenticated());
	knex('balances').where('buyer_id', req.params.id)
	.then(balances => {
		res.json(balances);
		});

const balances = (req, res) => {

	if(req.isAuthenticated()) {
		knex('balances').where('buyer_id', req.params.id)
		.then(balances => {
		res.json(balances);
		})
	} else {
		console.log("not authenticated")
	}
};


api.post('/store_plaid_token', (req, res, next) => {
	console.log("data received ", req.body.plaid_token)

	return knex('users')
	.where('id', req.user.id)
	.update({
		plaid_token:req.body.plaid_token,
	})
	.then(response => {res.json(response)});
	
});
	*/
