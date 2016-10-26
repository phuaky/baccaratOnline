console.log('Welcome to pHuatty Baccarrat Special!');

// -----DEAL CARDS-----分牌！！！
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

// deal(phua);
// deal(ong);
// deal(banker);
// deal(phua);
// deal(ong);
// deal(banker);
// deal(phua);
// deal(ong);
// deal(banker);
//
//
// console.log('value of card 1: ' + phua.cards[0].value + " " + phua.cards[0].suit + " " + phua.cards[0].face);
// console.log('value of card 2: ' + phua.cards[1].value + " " + phua.cards[1].suit + " " + phua.cards[1].face);
// console.log('value of card 3: ' + phua.cards[2].value + " " + phua.cards[2].suit + " " + phua.cards[2].face);
// console.log(phua);
// console.log('value of card 1: ' + ong.cards[0].value + " " + ong.cards[0].suit + " " + ong.cards[0].face);
// console.log('value of card 2: ' + ong.cards[1].value + " " + ong.cards[1].suit + " " + ong.cards[1].face);
// console.log('value of card 3: ' + ong.cards[2].value + " " + ong.cards[2].suit + " " + ong.cards[2].face);
// console.log(ong);
//
// console.log('value of card 1: ' + banker.cards[0].value + " " + banker.cards[0].suit + " " + banker.cards[0].face);
// console.log('value of card 2: ' + banker.cards[1].value + " " + banker.cards[1].suit + " " + banker.cards[1].face);
// console.log('value of card 3: ' + banker.cards[2].value + " " + banker.cards[2].suit + " " + banker.cards[2].face);
// console.log(banker);
