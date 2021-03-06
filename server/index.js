const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const passport = require('passport');
const { build, port, secret } = require('./config');
const { template } = require('./helpers');
const knex = require('./db/knex');
const api = require('./api');
const finapi = require('./finapi');
const aws = require('./aws');
const app = express();
const env = process.env.NODE_ENV || 'dev';

const { PLAID_PUBLISHABLE_KEY, STRIPE_PUBLIC_KEY, PLAID_CLIENT_ID } = require('../spldconfig');

/*
console.log('index PLAID_CLIENT_ID', PLAID_CLIENT_ID);
console.log('index PLAID_PUBLISHABLE_KEY', PLAID_PUBLISHABLE_KEY);
*/

var path = require('path');
var fs = require('fs');
var https = require('https');

app.use(express.static(build));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
  },
  // TODO: look into Redis connector
  store: new KnexSessionStore({ knex })
}));


const {
  strategy,
  serialize,
  deserialize
} = require('./passport');


passport.use(strategy);

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);


app.use(passport.initialize());
app.use(passport.session());

const home = (req, res) => res.send(template());


app.use('/api', api);
app.use('/finapi', finapi);
app.use('/aws', aws);
app.get('*', home);


if (env == 'dev') {

  console.log("process.env.NODE_ENV", env)
  var certOptions = {
    key: fs.readFileSync(path.resolve('build/cert/server.key')),
    cert: fs.readFileSync(path.resolve('build/cert/server.crt'))
  }

  var server = https.createServer(certOptions, app).listen(port, () => console.log(`Listening on port ${port}`));

} else {

  console.log("process.env.NODE_ENV", env)
  app.listen(port, () => console.log(`Listening on port ${port}`));

}




