'use strict';

const _ = require('lodash');
const md5 = require('md5');

const players = 4;
let won = [];
let iterationTotal = 0;

console.log(`${players} players started to play...`);

while (!won.length) {
  iterationTotal++;
  let iteration = 0;

  const values = {};
  let cards = [];
  const playerHand = [];
  let hashes = {};

  for (let i = 0; i < 4; i++) {
    for (let j = 6; j < 15; j++) {
      let name = j < 11 ? j : j === 11 ? 'J' : j === 12 ? 'Q' : j === 13 ? 'K' : j === 14 ? 'A' : '';
      name += (i === 0 ? '♠' : i === 1 ? '♣' : i === 2 ? '♦' : i === 3 ? '♥' : '');
      values[name] = j;
      cards.push(name);
    }
  }

  cards = _.shuffle(cards);

  const playingCardsBegin = playerHand;

  while (cards.length) {
    for (let i = 0; i < players; i++) {
      let card = cards.shift();
      if (card) playerHand[i] ? playerHand[i].push(card) : playerHand[i] = [card];
    }
  }

  let desk = [];
  let checkLooser = (desk) => {
      let totalNum = desk.length;
      let max = 0;
      let result = -1;
      let duplicate = 0;
      for (let i = 0; i < players; i++) {
        let value = values[desk[totalNum - players + i]];
        if (max === value) duplicate++;
        if (max < value) {
          max = value;
          result = i;
          duplicate = 0;
        }
      }

      return duplicate ? -1 : result;
    };

  while (1) {
    iteration++;
    let hash = playerHand.toString();
    if (hashes[hash]) {
      console.log(`CASE ${iterationTotal} LOOPING AFTER ${iteration}: ${playingCardsBegin}`);
      break;
    }

    hashes[hash] = 1;
    for (let i = 0; i < players; i++) {
      // console.log( `player ${i+1} hand: ${playerHand[ i ].join(', ')}` );
      if (!playerHand[i].length) won.push(i + 1);
      let card = playerHand[i].shift();
      desk.push(card);
    }

    if (won.length) {
      console.log(`player ${won.join(', ')} won on ${iteration} move with deck: ${playingCardsBegin}`);
      break;
    }

    let looser = checkLooser(desk);
    if (looser != -1) {
      // console.log( `desk ${iteration}: ${desk.join(', ')}, player ${looser+1} takes all` );
      for (let card of desk)
          playerHand[looser].push(card);
      desk = [];
    } else {
      // console.log( `table: ${desk.join(', ')}, DRAW!` );
    }
  }
}
