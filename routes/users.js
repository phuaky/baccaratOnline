var express = require('express');
var bodyParser = require('body-parser');
var db = require('../models');
var passport = require('../config/ppConfig');

var router = express.Router();

// CREATE NEW USER
router.post('/signup', function (req, res) {
  var email = req.body.email.toLowerCase();

  console.log('im trying to create');

  db.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      username: req.body.username,
      password: req.body.password
    }
  }).spread(function (user, created) {
    if (created) {
      // if created, success and redirect game
      console.log('User created!');
      res.redirect('/game-table');
    } else {
      // if not created, the email already exists
      console.log('Email already exists');
      res.redirect('/user/signup');
    }
  }).catch(function (error) {
    // if an error occurs, let's see what the error is
    console.log('An error occurred: ', error.message);
    res.redirect('/user/signup');
  });
});
//LOG IN
router.post('/login', passport.authenticate('local', {
  successRedirect: '/game-table',
  failureRedirect: '/users/signup'
}));
//LOG OUT
router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

/* GET Sign up page. */
router.get('/signup', function(req, res) {
  res.render('users/signup');
});

module.exports = router;
