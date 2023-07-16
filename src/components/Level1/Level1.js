import React, { useState, useEffect } from 'react';
import heartIcon from './heart.svg';
import Level2 from '../Level2/Level2';
import './Level1.css';

const Level1 = () => {
  const [showButton, setShowButton] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [points, setPoints] = useState(0);
  const [transitioned, setTransitioned] = useState(false); // Flag to track if transition to Level 2 has occurred

  const handleClick = () => {
    setShowButton(false);
    setPoints(prevPoints => prevPoints + 1); // Assign 1 point when Level 1 is finished
  };

  useEffect(() => {
    if (!showButton && countdown > 0) {
      const countdownTimeout = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      return () => clearTimeout(countdownTimeout);
    }

    if (!showButton && countdown === 0 && !transitioned) {
      setTransitioned(true); // Set the transition flag to true
    }
  }, [countdown, showButton, transitioned]);

  const renderHeartNumber = () => {
    const hearts = '❤️'.repeat(countdown);
    return [...hearts].join(' ');
  };

  return (
    <div className="level1-container">
      {!showButton && countdown > 0 && <h1 className="countdown">{renderHeartNumber()}</h1>}
      {!showButton && countdown === 0 && transitioned && <Level2 levelPoints={points} />}
      {showButton && (
        <button className="heart-button" onClick={handleClick}>
          <img className="heart-icon" src={heartIcon} alt="Heart" />
          <span className="heart-text">Start</span>
        </button>
      )}
    </div>
  );
};

export default Level1;
