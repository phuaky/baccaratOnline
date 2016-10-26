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
