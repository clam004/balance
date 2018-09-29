const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const { users } = require('./db/controllers');

const api = Router();

const env = process.env.NODE_ENV || 'dev';
const config = require('./db/knexfile.js')[env];
const knex = require('knex')(config);


const logout = (req, res) => {
  req.logout(); // not sure if this is working
  req.session.destroy() // this clears the session from the sessions table
  return res.status(200).send({ status: 200 });
};

const get_balances = (req, res) => {
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

api.post('/get_balances', get_balances);

api.get('/balances/:id', (req,res)=>{
	if(req.isAuthenticated()) {
		knex('balances').where('buyer_id', req.params.id)
		.then(balances => {
		res.json(balances);
		console.log("authenticated")
		});
	} else {
		knex('balances').where('buyer_id', req.params.id)
		.then(balances => {
		res.json(balances);
		console.log("authenticated")
		});
	}
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
