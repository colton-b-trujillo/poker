import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import { getCardNames, dealCards } from '../lib/cards';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Axios from 'axios';
import 'tailwindcss/tailwind.css';
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
    const MAX_CARD_HEIGHT = 50;
    const MAX_CARD_WIDTH = 23;
    const CARD_CSS = `max-h-50`;
    return cards.map((card, i) => {
      const imgSrc = `/card_images/${card}.PNG`;
      return <img src={imgSrc} className= {"max-h-30 lg:max-h-60" + (i == 0?' col-start-1':' col-start-auto')} alt={imgSrc} key={imgSrc}/>})
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
      <div className="grid grid-cols-5 gap-1">
                {renderCards(table.handOne)}
                {renderCards(table.cc)}
                {renderCards(table.handTwo)}
                </div>

        <div className={utilStyles.controlRow}>
        <div className={utilStyles.buttonContainer}>
          <button className={utilStyles.button} id='refreshButton' onClick={()=>location.reload()}>Deal</button>
          <button className={utilStyles.button} id='button' onClick={callOutcomeAPI}>Show Winners</button>
        </div>
        <div className={utilStyles.statusBox}>
          WINNING HAND: <span id='statusArea'></span>
        </div>      
      </div>
      </>
  )
}


function getAPIURL(playerOneHand, playerTwoHand, flop){
  let pc1 = playerOneHand.join(',');
  let pc2 = playerTwoHand.join(',');
  let cc = flop.join(',');
  const baseURL = `https://api.pokerapi.dev/v1/winner/texas_holdem?cc=${cc}&pc[]=${pc1}&pc[]=${pc2}`
  return baseURL;
}
