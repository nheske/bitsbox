var deck = [];
var c6, c7;
var suit = [];
var rank = [];
var players = [];
var nextCard = 0;
var isTableCheck = false;
var lastPingRequestTime;
var playersLabel = text('',100,1000,50)
var self=Date.now().toString().substring(9,12);
var debug = text(self,100,900);
var message = text('',40, 800, 40);
board();
reset();

var seconds = 600;
var words = text('GO', 100, 100, 100, 'black');
var isPaused = false;

function showCards(){
  send(['show', self, c6, c7]);
}

function clearTable(){
  send(['clear']);
  get(['clear']);
}

function pauseClock(){
  isPaused = !isPaused;
  send(['pause', isPaused]);
}

function resetTimer(){
  send(['resetTimer']);
  get(['resetTimer']);
}

function loop(){
  if(!isPaused){
    if(seconds > 0) {
     seconds = seconds -0.05;
     var minutes = Math.floor(seconds/60);
     var displaySeconds = Math.round(seconds % 60);
     words.change(minutes+':'+displaySeconds);
   } else{
     words.change('END');
     sound('alert',50,1);
     seconds = 600;
   }
  }
}

function preflop(){
  for (var i = 0; i < players.length; i++) {
    var someId = players[i];
    var card1 = getCard();
  	var card2 = getCard();
    var packets = [];
    packets[0] = 'deal'
    packets[1] = card1;
    packets[2] = card2;
    console.log('dealing '+card1+','+card2);
    if(someId == self){
      console.log('my cards');
//	  renderDeal(card1, card2);
      get(packets);
    } else{
      send(packets);
    }
  }
  f.change('flop');
  f.tap = flop;
}

function renderDeal(card1, card2){
      c6.change(card1);
      c7.change(card2);
}

function removePlayer(player){
  temp = players[players.length]
  for (i = 0; i < players.length; i++) {
    if(players[i] == player){
        players[i] = temp;
        players.pop();
        console.log(player+' removed');
      }
    }
  label = 'players: '
  for (i = 0; i < players.length; i++) {
    label += ' '+players[i];
  }
  playersLabel.change(label);
}

function addPlayer(player){
  players.push(player);
  label = 'players: '
  for (i = 0; i < players.length; i++) {
    label += ' '+players[i];
  }
  playersLabel.change(label);
}

function endTableCheck(){
  isTableCheck = false;
}

function tableCheck() {
  isTableCheck = false;
  players = [];
  players.push(self);
  lastPingRequestTime = Math.floor(Date.now() / 1000)
  send(['ping_request',lastPingRequestTime,self]);
  delay(endTableCheck, 2000);
}

function ping() {
  time = Math.floor(Date.now()/1000)
  send(['ping',time,self]);
}

// initial call, or just call refresh directly
//setTimeout(ping, 5000);

function getCard(){
  var someCard = deck[nextCard];
  nextCard = nextCard + 1;
  return someCard
}

function flop(){
//  var card1 = getCard();
//  card2 = getCard();
//  card3 = getCard();
//  cards = [card1,card2,card3]
  var packets = [];
  packets[0] = 'flop'
  packets[1] = getCard();
  packets[2] = getCard();
  packets[3] = getCard();
  send(packets);
  get(packets);
  //renderFlop(card1, card2, card3);
}

function get(input) {
  action = input[0];
  arg1 = input[1];
  card2 = input[2];
  card3 = input[3];
 // console.log('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
//  debug.change('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
  if(action == 'flop'){
    renderFlop(arg1, card2, card3)
  } else if(action == 'turn'){
    renderTurn(arg1)
  } else if(action == 'river'){
    renderRiver(arg1)
  } else if(action == 'shuffle'){
    reset();
  } else if(action == 'joined'){
    debug.change(arg1+' just joined')
  } else if(action == 'ping'){
    someId = input[2];
    console.log('got ping '+someId);
    if(!players.includes(someId)){
      addPlayer(someId);
    }
  } else if(action == 'ping_request'){
  //  ping();
  } else if(action == 'deal'){
    renderDeal(arg1, card2);
  } else if(action == 'player_list'){
      players.clear();
      for (i = 1; i < input.length; i++) {
 		players.push(input[i]);
      }
  } else if(action == 'join'){
    someId = input[2];
    console.log(someId+' joined');
    if(!players.includes(someId)){
      addPlayer(someId);
    }
  } else if(action == 'quit'){
    someId = input[2];
    removePlayer(someId);
  } else if(action == 'resetTimer'){
    seconds = 600;
    isPaused = false;
  } else if(action == 'pause'){
    isPaused = arg1;
  } else if(action == 'clear'){
    players = [];
    playersLabel.change('clear');
    quit.hide()
    join.show()
    watermelon.change('watermelon');
  } else if(action == 'show'){
    message.change(arg1+' has '+input[2]+','+input[3]);
  }
}

function flopButton(){
  flop()
}

function renderFlop(a, b, c){
  c1.change(a);
  c2.change(b);
  c3.change(c);
  f.change('turn');
  f.tap = turn;
}

function renderTurn(a){
  c4.change(a);
  f.change('river');
  f.tap = river;
}

function renderRiver(a){
  c5.change(a);
  f.change('shuffle');
  f.tap = shuffle;
}

function turn(){
  card4 = getCard();
  var list = [];
  list[0] = 'turn';
  list[1] = card4;
  delay(send(list), 1000);
//  delay(send('turn', card4, '', ''), 1000);
  renderTurn(card4);
}

function river(){
  card5 = getCard();
  var list = [];
  list[0] = 'river';
  list[1] = card5;
  delay(send(list), 1000);
//  delay(send('river', card5, '', ''), 1000);
  renderRiver(card5);
}
 

function shuffleDeck(array) {
  var i = 0, j = 0, temp = null
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}


function reset(){
//  tableCheck()
  nextCard = 0;
  f.change('deal');
  f.tap = preflop;
  c1.change(cardBack);
  c2.change(cardBack);
  c3.change(cardBack);
  c4.change(cardBack);
  c5.change(cardBack);
  c6.change(cardBack);
  c7.change(cardBack);
}

function shuffle(){
  shuffleDeck(deck);
  delay(send(['shuffle']), 1000);
  reset();
}

function createDeck(){
  rank[0] = '2';
  rank[1] = '3';
  rank[2] = '4';
  rank[3] = '5';
  rank[4] = '6';
  rank[5] = '7';
  rank[6] = '8';
  rank[7] = '9';
  rank[8] = '10';
  rank[9] = 'j';
  rank[10] = 'q';
  rank[11] = 'k';
  rank[12] = 'a';
  suit[0] = 'd';
  suit[1] = 'h';
  suit[2] = 's';
  suit[3] = 'c';
  deck = [];
  for (i = 0; i < 13; i++) {
    for (j = 0; j < 4; j++) {
      someCard = 'card'+rank[i]+suit[j]
      deck.push(someCard)
	}
  }
}

function board(){
  fill('white');
  flopy = 200;
  cardHeight = 200;
  cardBack = 'cube';
  c1 = stamp(cardBack,75, flopy,cardHeight);
  c2 = stamp(cardBack,225,flopy,cardHeight);
  c3 = stamp(cardBack,370,flopy,cardHeight);
  c4 = stamp(cardBack,550,flopy,cardHeight);
  c5 = stamp(cardBack,700,flopy,cardHeight);
  
  c6 = stamp(cardBack,100,550,cardHeight);
  c7 = stamp(cardBack,255,550,cardHeight);
  f = text('flop',75,flopy+200,100);
   shuff = stamp('@sam1', 700, 440, 200);
  shuff.tap = shuffle;
  createDeck();
  shuffleDeck(deck);
  setupButtons();
}

function setupButtons(){
  var resetButton = stamp('rtile', 600, 50, 40);
  resetButton.tap = resetTimer;
  var pauseButton = stamp('ptile', 650, 50, 40);
  pauseButton.tap = pauseClock;
  var clearButton = stamp('ctile', 700, 50, 40);
  clearButton.tap = clearTable;
  var showButton = stamp('stile', 750, 50, 40);
  showButton.tap = showCards;
  watermelon = stamp('watermelon',670,700)
  watermelon.tap = joinQuit;
  join = text('join',650,800)
  quit = text('quit',650,800)
  quit.hide()
}

function joinQuit() {
  var messageList = [];
  messageList[1] = Math.floor(Date.now()/1000);
  messageList[2] = self;
  if (quit.hidden) {
    messageList[0] = 'join';
    quit.show()
    join.hide()
    watermelon.change('cup');
  } else {
    messageList[0] = 'quit';
    quit.hide()
    join.show()
    watermelon.change('watermelon');
  }
  console.log('sending '+messageList);
  //sending join,1550438181,874
  send(messageList);
  get(messageList);
}
