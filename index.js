deck = [];
suit = [];
rank = [];
nextCard = 0;
debug = text('debug',100,900)
pOne = text('player1',100,1000,50)
pTwo = text('player2',500,1000,50)
var id='';
pOne.tap = playerOne;
pTwo.tap = playerTwo;
board();
reset();
//var id = window.navigator.userAgent.replace(/\D+/g, '').substring(0,3);
debug.change(id);

function playerOne(){
  pTwo.hide(); 
  id= 'player1';
  send(id,'joined');
}

function playerTwo(){
  pOne.hide(); 
  id='player2';
  send(id,'joined');
}

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
  debug.change('flop a='+card1+' b='+card2+' c='+card3);
//  send('flop', cards);
  list = [];
  list[0] = 'flop'
  list[1] = card1;
  list[2] = card2;
  list[3] = card3;
  send(list);
//  send('flop', card1, card2, card3);
  renderFlop(card1, card2, card3);
}

//function get(action, card1, card2, card3) {
function get(list) {
  action = list[0];
  card1 = list[1];
  card2 = list[2];
  card3 = list[3];
  console.log('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
  debug.change('in get '+action+' id='+id+' card1='+card1+' card2='+card2+' card3='+card3)
 
//  debug.change(action+' a='+card1+' b='+card2+' c='+card3)
//  debug.change('id='+id+' card2='+card2+' card3='+card3)
 // debug.change('received '+action)
  if(action =='flop'){
    renderFlop(card1, card2, card3)
  } else if(action =='turn'){
    renderTurn(card1)
  } else if(action =='river'){
    renderRiver(card1)
  } else if(action =='shuffle'){
    reset();
  } else if(action =='joined'){
    debug.change(card1+' just joined')
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
  
function shuffle(){
  list = [];
  list[0] = 'shuffle';
  delay(send(list), 1000);
//  delay(send('shuffle', '', '', ''), 1000);
  reset();
}

function reset(){
  nextCard = 0;
  f.change('flop');
  f.tap = flop;
  c1.change(cardBack);
  c2.change(cardBack);
  c3.change(cardBack);
  c4.change(cardBack);
  c5.change(cardBack);
  createDeck();
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
  f = text('flop',75,flopy+200,50);
  reset();
}

