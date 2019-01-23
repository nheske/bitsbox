cards = []
suit = []
rank = []
flopy = 200
cardsize = 200
prepare()
//flop()
deal = stamp('button',75,flopy+200,cardsize)
deal.tap = flop()

function tap() {
  send(random(cards))
}

function get(b) {
  text('received: ' + b, 28, yval, 'red')
}

function flop(){
  card1 = random(cards)
  card2 = random(cards)
  card3 = random(cards)
  flop1 = stamp(card1,75,flopy,cardsize)
  flop2 = stamp(card2,225,flopy,cardsize)
  flop3 = stamp(card3,370,flopy,cardsize)
}

function deal(){
  card1 = random(cards)
  card2 = random(cards)
  card3 = random(cards)
  flop1 = stamp(card1,75,flopy,cardsize)
  flop2 = stamp(card2,225,flopy,cardsize)
  flop3 = stamp(card3,370,flopy,cardsize)
  turn = stamp(random(cards),540,flopy,cardsize)
  river = stamp(random(cards),700,flopy,cardsize)
}
  
function prepare(){
  
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
