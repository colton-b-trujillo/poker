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
      return <Image src={imgSrc} width={125} height={180} alt={imgSrc} key={imgSrc} sizes="(max-width: 420px) 50vw, (max-width: 1200px) 25vw, 15vw"/>})
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
      {renderCards(table.handOne)}
      {renderCards(table.cc)}
      {renderCards(table.handTwo)}
   
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
