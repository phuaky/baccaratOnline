var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET Game page. */
router.get('/game-table', function(req, res) {
  currentUser = res.locals.currentUser
  res.render('gameplay/gameplay', {currentUser: currentUser});
});

module.exports = router;
