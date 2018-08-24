const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const { users } = require('./db/controllers');

const api = Router();

const logout = (req, res) => {
  req.logout();

  return res.status(200).send({ status: 200 });
};

// For testing
api.get('/ping', (req, res) => res.json({ message: 'pong' }));

api.post('/signup', users.signup);
api.post('/login', auth, users.login);
api.all('/logout', logout);

module.exports = api;
