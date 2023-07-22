import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import { getCardNames, dealCards } from '../lib/cards';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Axios from 'axios';

export async function getServerSideProps() {
  const allCards = getCardNames();
  const table = dealCards();
  return {
    props: {
      allCards,
      table
    },
  };
}

export default function Home({ allCards, table }) {

  function renderCards(cards){
    return cards.map((card, i) => {
      const imgSrc = `/card_images/${card}.PNG`;
      return <Image src={imgSrc} width='150' height='200' alt={imgSrc} key={imgSrc}/>})
  }

  const callOutcomeAPI = () => {
    Axios.get(getAPIURL(table.handOne,table.handTwo,table.cc)).then(res => {
      console.log(res.data);
      let winnerText = res.data.winners.map(winner => winner.result).join(',');
      document.getElementById('statusArea').appendChild(document.createTextNode(winnerText))
      document.getElementById('button').disabled = true;
    });
  }



  return (
    <>
    <div className={utilStyles.wrapper}>
      <div className={utilStyles.topRow}>
        <div className={utilStyles.topLeft}>
      {renderCards(table.handOne)}
       </div>
      </div>
      <div className={utilStyles.middleRow}>
      {renderCards(table.cc)}
      </div>
      <div className={utilStyles.bottomRight}>
      {renderCards(table.handTwo)}
      </div>
    </div>
    <div className={utilStyles.controlRow}>
      <button className={utilStyles.button} id='button' onClick={callOutcomeAPI}>Show Winners</button>
      <span className={utilStyles.statusArea} id='statusArea'>WINNING HAND: </span>      
    </div>

        </>
  )
}


function getAPIURL(playerOneHand, playerTwoHand, flop){
  let pc1 = '8D,8S';//playerOneHand.join(',');
  let pc2 = '8C,8H';//playerTwoHand.join(',');
  let cc = flop.join(',');
  const baseURL = `https://api.pokerapi.dev/v1/winner/texas_holdem?cc=${cc}&pc[]=${pc1}&pc[]=${pc2}`
  return baseURL;
}
