var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var passport = require('./config/ppConfig');
const dotenv = require('dotenv');
dotenv.load();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.currentUser = req.user;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/game-table', routes)

const playersInGame = []

function findPlayer (id) {
  var newArr = playersInGame.filter(function (c) { return c.socketID === id })[0]
  console.log(">>>",newArr);
  return newArr
}

io.on('connection', function(socket){

  socket.on('Shuffled Deck', function(){ //Deck received and on server
    assign(shuffle(deck));
    console.log("### Number of player in game: " + playersInGame.length + "players are: " );
    //Deal Cards back to clients
    for (var j = 0; j < 2; j++) {
      for (var i = 0; i < playersInGame.length; i++) {
        deal(playersInGame[i])
        console.log('dealing to ', playersInGame[i].name);
        console.log(playersInGame[i].cards);
        // io.emit('dealt cards face', playersInGame[i]);
      }
      //PUSH ENTIRE PLAYER OBJECT BACK TO CLIENT.JS
    }
  });

  //listen for draw
  socket.on('draw', function (user) { //pass user.name
    console.log('im drawing');
    console.log("drawing user's particular: ", user);
    console.log(playersInGame);
    let player = findPlayer(socket.id)
    var arrayIndex = playersInGame.indexOf(player);
    deal(playersInGame[arrayIndex])
    console.log('drawn');
    console.log(playersInGame[arrayIndex].cards);
  })

  // listen for a user to join table
  socket.on('join', (user) => {

    user.socketID = socket.id
    user.inGame = true
    playersInGame.push(user)
    let player = user
    // console.log("this is player>>>>>", player);
    console.log("pig array>>>>>", playersInGame);
    // emit welcome message to new user
    socket.emit('welcome', `Hi ${player.name}, welcome to pHuatty Baccarrat!`)
    // broadcast their arrival to everyone else
    socket.broadcast.emit('joined', user)
    // io.sockets.emit('online', connections)

    console.log(`## ${player.name} joined the chat on (${socket.id}).`)
  })

  // listen for a disconnect event
  socket.once('disconnect', () => {
    // find the connection and remove from the collection
    console.log('diconnecting');
    let player = findPlayer(socket.id)
    if (player) {
      console.log("now player>>", player);
      player.inGame = false
      playersInGame.splice(playersInGame.indexOf(player),1)
      console.log('removed');
      console.log("playersingame>>>", playersInGame);

      if (player.name) {
        socket.broadcast.emit('left', player.name)
        socket.broadcast.emit('online', playersInGame)
        console.log(`## ${player.name}(${player.socketID}) disconnected. Remaining: ${playersInGame.length}.`)
      } else {
        console.log(`## Connection (${player.socketID}) (${socket.id}) disconnected. Remaining: ${playersInGame.length}.`)
      }
    }
    socket.disconnect()
  })
});

// GAMELOGIC

// -----Start with blank array-----
var deck = [];
for (var i = 1; i < 53; i++) { // Loop and push into deck array
  deck.push(i);
}

// -----Fisher Yates Card Shuffling-----
function shuffle (array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  // console.log(array);
  return array;
}

function card (value, suit, face, order) {
  this.value = value;
  this.suit = suit;
  this.face = face;
  this.order = order;
}

// -----Assign value & suit to shuffled deck-----
function assign (array) {
  // Clear Deck
  clientDeck = []

  for (var i = 0; i < array.length; i++) {

    // ------GET VALUE OF CARDS ------
    var vaalue = array[i] % 13;
    if (vaalue % 13 >= 10) {
      vaalue = 0;
    }
    // console.log(vaalue)

    // ------GET order OF CARDS ------
    var orrder = array[i] % 13;

    // ------GET SUIT OF CARDS ------
    var suuit = Math.floor((array[i] - 1) / 13);
    if (suuit === 0) {
      suuit = 'Diamonds';
    } else if (suuit === 1) {
      suuit = 'Clubs';
    } else if (suuit === 2) {
      suuit = 'Hearts';
    } else if (suuit === 3) {
      suuit = 'Spades';
    }
    // console.log(suuit)

    // ------GET FACE OF CARDS ------
    var faace = array[i] % 13;
    if (faace === 11) {
      faace = 'Jack';
    } else if (faace === 12) {
      faace = 'Queen';
    } else if (faace === 0) {
      faace = 'King';
    } else if (faace === 1) {
      faace = 'Ace';
    }

    var cardy = new card(vaalue, suuit, faace, orrder);
    clientDeck.push(cardy);
  }
  // console.log(clientDeck);

}

var clientDeck = [];

//DEAL CARDS
function deal (ghost) {
  var takeTopCard = clientDeck.shift(); //taking out first card
  ghost.cards.push(takeTopCard); //storing into player's card array
  ghost.valueOfHand = valueOfHand(ghost) //storing value of hand into player's value
  ghost.sameCard = sameCard(ghost)
  ghost.suited = suited(ghost)
  ghost.allPictures = allPictures(ghost)
  ghost.handType = handTypeOfHand(ghost)
  ghost.payout = payout(ghost)
}

// Check Handtype Of Hand
function handTypeOfHand (player) {
  var handType = '';
  if (player.cards.length === 3) {
    return handType = royalFlushCheck(player)
  } else if (player.cards.length === 2) { //2 Cards
    return handType = naturalCheck(player)
  }
}
// Natural Double/Suited
// Natural 9 / 8
function naturalCheck (player) {
  //check Natural 9 suited
  if (player.valueOfHand === 9) {
    // console.log('im nine');
    if (player.suited !== false) {
      // console.log('9 Natural Dubs');
      return '9 Natural Dubs'
    } else { //check Natural 9
      // console.log('9 Natural');
      return '9 Natural'
    }
    // check Natural 8 suited & pair
  } else if (player.valueOfHand === 8) {
    // console.log('im eight');
    if (player.suited !== false || player.sameCard !== false) {
      // console.log('8 Natural Dubs');
      return '8 Natural Dubs'
    } else {//check Natural 8
      // console.log('8 Natural');
      return '8 Natural'
    }
    //no natural
  } else {
    return pair(player)
  }
}
// Royal Flush
function royalFlushCheck (player) {
  if (player.valueOfHand === 0 && player.suited !== false && player.allPictures && conseq(player)) {
      return 'Royal Flush'
  } else { // Check Straight Flush
    // console.log('no royale');
    return straightFlushCheck(player)
  }
}
// Straight Flush
function straightFlushCheck (player) {
  if (player.suited !== false && conseq(player)) {
      return 'Straight Flush'
  } else { //check straight
    // console.log('no straightflush');
    return triples(player)
  }
}
// Three of a kind
function triples (player) {
  if (player.sameCard === 'triple'){
      return 'Triple'
  } else {
    // console.log('no triple');
    return straightFaceCards(player)
  }
}
// Straight 3 face cards
function straightFaceCards (player) {
  if (player.valueOfHand === 0 && player.allPictures && conseq(player)) {
    return 'Straight Pictures'
  } else {
    // console.log('no 3 face cards');
    return straight(player)
  }
}
// Straight
function straight (player) {
  if (conseq(player)) {
    return 'Straights'
  } else {
    // console.log('no Straights');
    return threeFaceCard(player)
  }
}
// Any 3 Face card
function threeFaceCard (player) {
  if (player.allPictures) {
    return '3 Pictures'
  } else {
    // console.log('no 3 face cards');
    return threeSameSuit(player)
  }
}
// Any 3 Same Suit
function threeSameSuit (player) {
  if (player.suited !== false) {
    return '3 Suited'
  } else {
    // console.log('no 3 same suit');
    return pair(player)
  }
}
// Pair
function pair (player) {
  if (player.sameCard === 'pair'){
      return 'Pair'
  } else {
    // console.log('no pair');
    return twoSuited(player)
  }
}
// 2 suited
function twoSuited (player) {
  if (player.suited !== false) {
    return '2 Suited'
  } else {
    // console.log('no 2 suited');
    // console.log('last');
    return false
  }
}


// Check VALUE Of Hand
function valueOfHand (player) {
  var valOfHand = 0;
  if (player.cards.length >= 2 && player.cards.length <= 3) { //if 2 or 3 cards
    for (var i = 0; i < player.cards.length; i++) {
      valOfHand += player.cards[i].value;
      if (valOfHand >= 10) {
        valOfHand -= 10;
      }
    }
    // console.log('valOfHand: ' + valOfHand)
    return valOfHand
  }
}

//Check SAME CARD??
function sameCard (player) {
  var same = false; //always not same
  if (player.cards.length >= 2 && player.cards.length <= 3) { //if 2 or 3 cards
    if (player.cards.length === 3) { //if 3 cards, check same
      if (player.cards[0].face === player.cards[1].face && player.cards[1].face === player.cards[2].face) {
        same = 'triple';
      }
    } else if (player.cards.length === 2) { //if 2 cards, check same
      if (player.cards[0].face === player.cards[1].face) {
        same = 'pair';
      }
    }
    return same
  }
}

// Check SUITED??
function suited (player) {
  var suit = false; //always not suited
  if (player.cards.length >= 2 && player.cards.length <= 3) { //if 2 or 3 cards
    if (player.cards.length === 3) { //if 3 cards, check suited
      if (player.cards[0].suit === player.cards[1].suit && player.cards[1].suit === player.cards[2].suit) {
        suit = '3x ' + player.cards[0].suit;
      }
    } else if (player.cards.length === 2) { //if 2 cards, check suited
      if (player.cards[0].suit === player.cards[1].suit) {
        suit = '2x ' + player.cards[0].suit;
      }
    }
    return suit
  }
}

//Check for Picture cards
function allPictures (player) {
  for (var j = 0; j < player.cards.length; j++) {
    if (player.cards[j].face == 'Ace') {
      return false
    }
    if (!isNaN(player.cards[j].face)){
      return false
    }
  }
  return true
}

//Check for Consequtive cards
function conseq (player) {
  var array = []
  for (var k = 0; k < player.cards.length; k++) {
    array.push(player.cards[k].order)
  }
  // console.log(array);
  array.sort(function(a, b){return a-b})
  // console.log('sorted array: ' + array);
  if(array[0] + 1 === array[1] && array[1] + 1 === array[2]) {
    // console.log('WE HAVE A STRAIGHT');
    return true
  } else {
    return false
  }
}

function payout (player) {
  if (player.handType !== false) {
    if (player.handType === '9 Natural Dubs' || player.handType === '8 Natural Dubs' || player.handType === 'Pair' || player.handType === '2 Suited') {
      return 2;
    }
    if (player.handType === '9 Natural' || player.handType === '8 Natural') {
      return 1;
    }
    if (player.handType === 'Royal Flush') {
      return 7;
    }
    if (player.handType === 'Straight Flush' || player.handType === 'Triple') {
      return 5;
    }
    if (player.handType === 'Straight Pictures') {
      return 4;
    }
    if (player.handType === 'Straights' || player.handType === '3 Pictures' || player.handType === '3 Suited') {
      return 3;
    }
  } else {
    return 1;
  }
}



http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = app;
