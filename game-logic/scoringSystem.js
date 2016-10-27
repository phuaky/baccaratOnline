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
