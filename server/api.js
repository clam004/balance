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
  req.logout(); // not sure if this is working
  req.session.destroy() // this clears the session from the sessions table
  return res.status(200).send({ status: 200 });
};

const get_balances = (req, res, ) => {
	//res.json(req.isAuthenticated())
	knex('balances').where('buyer_id', req.body.user_id).orWhere('seller_id', req.body.user_id)
	.then(balances => {
		res.json(balances);
	});
};

// For testing
api.get('/ping', (req, res) => res.json({ message: 'pong'}));

api.post('/signup', users.signup);
api.post('/login', auth, users.login);
api.all('/logout', logout);

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

api.post('/get_balances', (req, res, next) => {
 	console.log(req.body)
 	if(req.isAuthenticated()) {

		knex('balances')
		.where('buyer_id',req.body.user_id).orWhere('seller_id',req.body.user_id)
		.then(balances => {
			res.json(balances);
		});

		console.log("post get_user authenticated")
	}	
});


api.get('/getusers', (req,res)=>{
    //console.log(req)
	knex('users').select(['id','email','username','num_completed_balances'])
		.then(users => {
			res.json(users);
		});

	if(req.isAuthenticated()) {
		console.log("get getuser authenticated")
	}
});


api.post('/get_users', (req, res, next) => {
 	console.log(req.body)
	knex('users').select(['id','email','username','num_completed_balances']).whereNot('id',req.body.id)
		.then(users => {
			res.json(users);
		});

	if(req.isAuthenticated()) {
		console.log("post get_user authenticated")
	}	
});



api.post('/submit_balance', (req, res, next) => {
 	console.log(" data received ", req.body)
 	// milliseconds, seconds, minutes, hours, days, weeks, months, quarters, years 
    var due_date = moment().add(req.body.agreement.duration, req.body.agreement.duration_units);
 	return knex('balances')
 	.insert({
 		title:req.body.agreement.title,
 		balance_description:req.body.agreement.description,
 		buyer_obligation:req.body.agreement.buyer_obligation,
 		seller_obligation:req.body.agreement.seller_obligation,
 		buyer_email:req.body.buyer.email,
 		seller_email:req.body.seller.email,
 		completed:false,
 		buyer_id:req.body.buyer.id,
 		seller_id:req.body.seller.id,
 		buyer_stake_amount:req.body.buyer.stake,
 		seller_stake_amount:req.body.seller.stake,
 		balance_price:req.body.agreement.payment,
 		due_date:due_date
 	})
 	//.then(response => {res.json(response)});
 	.returning('id')
	.then((id) => {
	  res.json({id:id[0]})
	});
});

api.post('/toggle_confirm', (req, res, next) => {
	console.log("data received ", req.body)
	
	return knex('balances')
	.where('id',req.body.id)
	.update({
		agreement_confirmed:!req.body.confirm,
		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
	})
	.then(response => {res.json(response)});
	
});

api.post('/toggle_complete', (req, res, next) => {
	console.log("data received ", req.body)
	
	return knex('balances')
	.where('id',req.body.id)
	.update({
		completed:!req.body.completed,
		updated_at:moment().format("YYYY-MM-DDTHH:mm:ss")
	})
	.then(response => {res.json(response)});
	
});

api.post('/balance_done', (req, res, next) => {
	console.log("data received ", req.body)
 	return knex('history')
 	.insert({
 		balance_id:req.body.balance.id,
 		title:req.body.balance.title,
 		balance_description:req.body.balance.balance_description,
 		buyer_obligation:req.body.balance.buyer_obligation,
 		seller_obligation:req.body.balance.seller_obligation,
 		buyer_email:req.body.balance.buyer_email,
 		seller_email:req.body.balance.seller_email,
 		completed:req.body.balance.completed,
 		agreement_confirmed:req.body.balance.agreement_confirmed,
 		buyer_id:req.body.balance.buyer_id,
 		seller_id:req.body.balance.seller_id,
 		buyer_stake_amount:req.body.balance.buyer_stake_amount,
 		seller_stake_amount:req.body.balance.seller_stake_amount,
 		balance_price:req.body.balance.balance_price,
 		created_at:req.body.balance.created_at,
 		updated_at:req.body.balance.updated_at,
 		due_date:req.body.balance.updated_at,
 		completed_date:moment().format("YYYY-MM-DDTHH:mm:ss")
 	})	
 	.then(() => {
 		return knex('balances')
		.where('id',req.body.balance.id)
		.del()
 	})
});


api.post('/get_balance_data', (req, res, next) => {

 	console.log(req.body)

	knex('balances')
		.where('id',req.body.balance_id)
		.then(balance => {
			res.json(balance);
		});

	if(req.isAuthenticated()) {
		console.log("post get_user authenticated")
	}	
});


api.post('/balance_delete', (req, res, next) => {
	
 	return knex('balances')
	.where('id',req.body.id)
	.del()
	.then(response =>{
		console.log("delete", req.body.id, "response", response)
	})
 });


module.exports = api;


	/*




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

	*/
