const { User, Entry, ScoreCard, Checklist } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  isAuthenticated(req, res) {
    const isLoggedIn = Boolean(req.user && req.user.id);

    return res.json({
      isAuthenticated: isLoggedIn,
      currentUser: req.user
    });
  },

  fetch(req, res) {
    return User.fetch()
      .then(users => res.json({ users }))
      .catch(err => handleError(res, err));
  },

  login(req, res) {
    return User.authenticate(req.body)
      .then(user => res.json({ user }))
      .catch(err => handleError(res, err))
  },

  signup(req, res) {
    return User.register(req.body)
      .then(user => res.json({ user }))
      .catch(err => handleError(res, err));
  }
};
