cards = []
suit = []
rank = []
flopy = 200
cardHeight = 200;
cardBack = 'arrow6'
  c1 = stamp(cardBack,75, flopy,cardHeight)
  c2 = stamp(cardBack,225,flopy,cardHeight)
  c3 = stamp(cardBack,370,flopy,cardHeight)
  c4 = stamp(cardBack,550,flopy,cardHeight)
  c5 = stamp(cardBack,700,flopy,cardHeight)
debug = text('debug',100,900)
board()
reset()

function get(m,card1, card2, card3) {
  debug.change('m='+m+' a='+card1+' b='+card2+' c='+card3)
  if(m =='f'){
    debug.change('flop')
    renderFlop(card1, card2, card3)
  } else if(m =='t'){
    debug.change('turn')
    renderTurn(card1)
  } else if(m =='r'){
    debug.change('river')
    renderRiver(card1)
  } else if(m =='s'){
    debug.change('shuffle')
    reset()
  }
}

function flopButton(){
  flop()
}

function flop(){
  card1 = random(cards)
  card2 = random(cards)
  card3 = random(cards)
  delay(send('f', card1, card2, card3),1000)
  renderFlop(card1, card2, card3)
}

function renderFlop(a, b, c){
  c1.change(a)
  c2.change(b)
  c3.change(c)
  f.change('turn')
  f.tap = turn
}

function renderTurn(a){
  c4.change(a)
  f.change('river')
  f.tap = river
}

function renderRiver(a){
  c5.change(a)
  f.change('shuffle')
  f.tap = shuffle
}

function turn(){
  card4 = random(cards)
  delay(send('t', card4, '', ''), 1000)  
  renderTurn(card4)
}

function river(){
  x = random(cards)
  delay(send('r', x, '', ''), 1000)
  renderRiver(x)
}
  
function shuffle(){
  delay(send('s', '', '', ''), 1000)
  reset()
}

function reset(){
  f.change('flop')
  f.tap = flop
  c1.change(cardBack)
  c2.change(cardBack)
  c3.change(cardBack)
  c4.change(cardBack)
  c5.change(cardBack)
}

function board(){
  fill('darkgray')
  f = text('flop',75,flopy+200,50)
  rank[0] = '2'
  rank[1] = '3'
  rank[2] = '4'
  rank[3] = '5'
  rank[4] = '6'
  rank[5] = '7'
  rank[6] = '8'
  rank[7] = '9'
  rank[8] = '10'
  rank[9] = 'j'
  rank[10] = 'q'
  rank[11] = 'k'
  rank[12] = 'a'
  suit[0] = 'd'
  suit[1] = 'h'
  suit[2] = 's'
  suit[3] = 'c'
  for (i = 0; i < 13; i++) {
		for (j = 0; j < 4; j++) {
			//stamp('card'+rank[1]+suit[3])
			someCard = 'card'+rank[i]+suit[j]
      		cards.push(someCard)
		}
	}
}
