deck = [];
suit = [];
rank = [];
players = [];
nextCard = 0;
isTableCheck = false;
var lastPingRequestTime;
debug = text('debug',100,900)
playersLabel = text('',100,1000,50)
var id=Date.now().toString().substring(9,12);
players[0] = id;
updatePlayersLabel();
board();
reset();
//var id = window.navigator.userAgent.replace(/\D+/g, '').substring(0,3);
debug.change(id);

seconds = 600;
words = text('GO', 100, 100, 100, 'black');
clock = stamp('clock',600,50, 50);
clock.tap = resetTimer;
pause = false;
pauseButton = stamp('pawn', 700, 50, 80);
pauseButton.tap = pauseClock;

function pauseClock(){
  pause = !pause;
  pauseList = ['pause', pause];
  send(pauseList);
}

function resetTimer(){
  seconds = 600;
  console.log('seconds='+seconds);
  pingList = [];
  pingList[0] = 'resetTimer';
  send(pingList);
  pause = false;
}

function loop(){
  if(!pause){
    if(seconds > 0) {
     seconds = seconds -0.05;
     minutes = Math.floor(seconds/60);
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
  for (i = 0; i < players.length; i++) {
    someId = players[i];
    card1 = getCard();
  	card2 = getCard();
    list = [];
    list[0] = 'deal'
    list[1] = card1;
    list[2] = card2;
    console.log('dealing '+card1+','+card2);
    if(someId == id){
      console.log('my cards');
	  renderDeal(card1, card2);
    } else{
      send(list);
    }
  }
  f.change('flop');
  f.tap = flop;
}

function renderDeal(){
      c6.change(card1);
      c7.change(card2);
}

function updatePlayersLabel(){
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
  players.push(id);
  lastPingRequestTime = Math.floor(Date.now() / 1000)
  pingRequestList = [];
  pingRequestList[0] = 'ping_request';
  pingRequestList[1] = lastPingRequestTime;
  pingRequestList[2] = id;
  send(pingRequestList);
  delay(endTableCheck, 2000);
}

function ping() {
  time = Math.floor(Date.now()/1000)
  pingList = [];
  pingList[0] = 'ping';
  pingList[1] = time;
  pingList[2] = id;
  send(pingList);
}

// initial call, or just call refresh directly
//setTimeout(ping, 5000);

function getCard(){
  //var randomnumber = Math.floor(Math.random()*deck.length);
  //var randomnumber = random(deck.length);
  //var someCard = deck[randomnumber];
  var someCard = deck[nextCard];
  nextCard = nextCard + 1;
  console.log('removing '+someCard)
  //deck[randomnumber] = deck[deck.length-1]
  //deck.pop();
  console.log('getCard='+someCard);
  return someCard
}

function flop(){
  card1 = getCard();
  card2 = getCard();
  card3 = getCard();
  cards = [card1,card2,card3]
//  debug.change('flop a='+card1+' b='+card2+' c='+card3);
  list = [];
  list[0] = 'flop'
  list[1] = card1;
  list[2] = card2;
  list[3] = card3;
  send(list);
  renderFlop(card1, card2, card3);
}

//function get(action, card1, card2, card3) {
function get(list) {
  action = list[0];
  card1 = list[1];
  card2 = list[2];
  card3 = list[3];
//  console.log('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
//  debug.change('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
  if(action == 'flop'){
    renderFlop(card1, card2, card3)
  } else if(action == 'turn'){
    renderTurn(card1)
  } else if(action == 'river'){
    renderRiver(card1)
  } else if(action == 'shuffle'){
    reset();
  } else if(action == 'joined'){
    debug.change(card1+' just joined')
  } else if(action == 'ping'){
    someId = list[2];
    console.log('got ping '+someId);
    if(!players.includes(someId)){
      players.push(someId);
      updatePlayersLabel();
    }
  } else if(action == 'ping_request'){
  //  ping();
  } else if(action == 'deal'){
    renderDeal(card1, card2);
  } else if(action == 'player_list'){
      players.clear();
      for (i = 1; i < list.length; i++) {
 		players.push(list[i]);
      }
  } else if(action == 'join'){
    someId = list[2];
    if(!players.includes(someId)){
      players.push(someId);
      updatePlayersLabel();
      console.log(someId+' joined');
    }
//    ping();//all players will be known to all browsers
  } else if(action == 'quit'){
    someId = list[2];
    temp = players[players.length]
    for (i = 1; i < list.length; i++) {
      if(players[i] == someId){
        players[i] = players[players.length];
        players.pop();
        updatePlayersLabel();
        console.log(someId+' quit');
      }
    }
  } else if(action == 'resetTimer'){
    seconds = 600;
    pause = false;
  } else if(action == 'pause'){
    pause = list[1];
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
  list = [];
  list[0] = 'turn';
  list[1] = card4;
  delay(send(list), 1000);
//  delay(send('turn', card4, '', ''), 1000);
  renderTurn(card4);
}

function river(){
  card5 = getCard();
  list = [];
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

function shuffle(){
  shuffleDeck(deck);
  list = [];
  list[0] = 'shuffle';
  delay(send(list), 1000);
//  delay(send('shuffle', '', '', ''), 1000);
  reset();
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
}

w = stamp('watermelon',670,700)
w.tap = joinQuit;
join = text('join',650,800)
quit = text('quit',650,800)
quit.hide()

function joinQuit() {
  messageList = [];
  messageList[1] = Math.floor(Date.now()/1000);
  messageList[2] = id;
  if (quit.hidden) {
    messageList[0] = 'join';
    quit.show()
    join.hide()
    w.change('cup');
  } else {
    messageList[0] = 'quit';
    quit.hide()
    join.show()
    w.change('watermelon');
  }
  //  console.log('sending '+messageList);
  send(messageList);

}
