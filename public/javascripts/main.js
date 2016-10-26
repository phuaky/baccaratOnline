var socket = io();

// var currentUser =
// create an object for storing our user
var user = {
  name: 'anon',
  type: 'player',
  valueOfHand: '',
  handType: '',
  payout: '',
  sameCard: '',
  cards: [],
  suited: '',
  allPictures: '',
}

// -----GENERAL JAVASCRIPT-----
//Menu Trigger
$('#menu').click(function() {
  $('.ui.sidebar')
    .sidebar('toggle');
})
$('#log-in').click(function() {
  console.log('click');
  $('.ui.modal')
    .modal('show')
  ;
})

// -----GAME JAVASCRIPT-----

// handle submission for joining the table
$('#joinTable').click(function (event) {

  // console.log(currentUserString)
  var currentUser = JSON.parse(currentUserString)
  user.name = currentUser.username

  console.log('Joining table with name: ', user.name)
  socket.emit('join', user)
  // $('#sendJoin').focus()
  //
  // // asuming it is will be successful so hide the form
  // $('section#join').addClass('hidden')
  //
  // // halt default form behaviour
  // return false
})

// message received that new user has joined the table
socket.on('joined', function (user) {
  console.log(user.name + ' joined left the chat.')
  $('#messages').append($('<div class="center">').html('<strong>' + user.name + ' joined the chat.' + '<strong> '))
})
// handle leaving message
socket.on('left', function (user) {
  console.log(user.name + ' left the chat.')
  $('#messages').prepend($('<div class="center">').html('<strong>' + user.name + ' left the chat.' + '<strong> '))
})

// keep track of who is ONLINE
  socket.on('online', function (playersInGame) {
    var names = ''
    console.log('playersInGame: ', playersInGame)
    for (var i = 0; i < playersInGame.length; ++i) {
      if (playersInGame[i].name) {
        if (i > 0) {
          if (i === playersInGame.length - 1) names += ' and '
          else names += ', '
        }
        names += playersInGame[i].name
      }
    }
    $('#messages').append($('<li>').text(names));
  })

//ON CLICK OF DEAL
 $('#deal').click(function() {
   // Create and Shuffle new deck
   assign(shuffle(deck));
   //Send deck to server
   socket.emit('Shuffled Deck', clientDeck) //Send Shuffled Deck Array to server

   // Deal Cards to all players on table
 });

socket.on('show cards', function(deck) {
  $('#messages').append($('<li>').text(deck[0].face));
})

socket.on('dealt cards', function(playerObject) {
  console.log(playerObject);
})


// ON CLICK OF DRAW
$('#draw').click(function() {
  deal(phua)
  console.log(phua);
})
