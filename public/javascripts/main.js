var socket = io();

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

// handle submission for CREATING the table
$('#createTable').click(function () {
  var currentUser = JSON.parse(currentUserString)
  user.name = currentUser.username
  user.type = 'banker'
  console.log('Creating table with name: ', user.name)
  socket.emit('create', user)
})

//handle DESTROY table
$('#destroyTable').click(function () {
  console.log('destroying');
  user.type = 'player'
  socket.emit('destroy')
})

// handle submission for joining the table
$('#joinTable').click(function () {
  // console.log(currentUserString)
  var currentUser = JSON.parse(currentUserString)
  user.name = currentUser.username
  console.log('Joining table with name: ', user.name)
  socket.emit('join', user)
})

//handle quit table
$('#quitTable').click(function () {
  console.log('quiting');
  socket.emit('quit')
})
//CHECK IF THERES A TABLE
socket.on('tableTrue', function(msg) {
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').text(msg))
})

socket.on('tableFalse', function(msg) {
  $('#create').removeClass('hidden')
  $('#messages').prepend($('<li>').text(msg))
})

// welcome message received from the server
socket.on('welcome', function (msg) {
  console.log('Received welcome message: ', msg)
  // enable the form and add welcome message
  $('#join').addClass('hidden')
  $('#quit').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + msg + '<strong>'))
})

// pls play again
socket.on('quit', function (msg) {
  $('#quit').addClass('hidden')
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + msg + '<strong>'))
})

// message broacast that banker created the table
socket.on('created', function (user) {
  console.log(user.name + ' created the table and is the banker.')
  $('#create').addClass('hidden')
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' created the table and is the banker.' + '<strong> '))
})
// message to banker
socket.on('readyToPlay', function(msg) {
  $('#create').addClass('hidden')
  $('#destroy').removeClass('hidden')
  $('#bankerDeal').removeClass('hidden')
  $('#messages').prepend($('<li>').html(msg))
})
// banker destroyed table already
socket.on('destroyed', function(msg) {
  $('#create').removeClass('hidden')
  $('#bankerDeal').addClass('hidden')
  $('#destroy').addClass('hidden')
  $('#join').addClass('hidden')
  $('#quit').addClass('hidden')
  console.log('ive destroyed the table');
})

// message received that new user has joined the table
socket.on('joined', function (user) {
  console.log(user.name + ' joined the table.')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' joined the table.' + '<strong> '))
})
// handle leaving message
socket.on('left', function (user) {
  console.log(user.name + ' left the table.')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' left the table.' + '<strong> '))
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
    $('#messages').prepend($('<li>').text(names));
  })

//ON CLICK OF DEAL
 $('#deal').click(function() {
   socket.emit('deal cards') //Send Shuffled Deck Array to server
 });


socket.on('stop deal', function() {
  console.log('removing deal button');
  $('#deal').addClass('disabled')
})

// ON CLICK OF DRAW
$('#draw').click(function(event) {
  console.log('draw');
  console.log(user);
  console.log(user.name);
  socket.emit('draw', user.name)
})
//STOP DRAW
socket.on('stop draw', function() {
  console.log('im back to disable draw');
  $('#draw').addClass('disabled')
})

//Receive cards
socket.on('oneCard', function(card) {
  console.log('card received is', card);
  $('#hand').append($('<li>').text(card.face))
  $('#hand').append($('<li>').text(card.suit))
})

//Receive player object
socket.on('player', function(playerHand) {
  console.log('card received is', playerObject);
  $('#playerObject').append($('<li>').text(playerObject))
})
