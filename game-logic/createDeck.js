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
