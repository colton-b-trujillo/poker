import fs from 'fs';
import path from 'path';

const cardsDirectory = path.join(process.cwd(), '/public/card_images');

export function getCardNames() {
  // Get file names under /card_images
  const fileNames = fs.readdirSync(cardsDirectory);
  const allCardNames = fileNames.map((fileName) => {
    // Remove ".png" from file name to get id
    const id = fileName.replace(/\.png$/, '');
    return id;
  });
  return allCardNames;
}

function drawCard(deck){
  let index = Math.floor(Math.random() * deck.length)-1;
  let fileName = deck.splice(index, 1)[0];
  return fileName.split('.')[0];
}

export function dealCards(){
  let deck = getCardNames();
  let playerOneHand = Array.from({ length: 2 }, (v, i) => i).map((i) => drawCard(deck));
  let playerTwoHand = Array.from({ length: 2 }, (v, i) => i).map((i) => drawCard(deck));
  let flop = Array.from({ length: 5 }, (v, i) => i).map((i) => drawCard(deck));
  return {handOne: playerOneHand,
          handTwo: playerTwoHand,
          cc: flop}
}