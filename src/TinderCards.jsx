import React, { useState, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './TinderCards.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
const TinderCards = () => {
  const [people, setPeople] = useState([
    {
      name: 'John Doe',
      url: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=John+Doe'
    },
    {
      name: 'Jane Smith',
      url: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=Jane+Smith'
    },
    {
      name: 'Sara Wilson',
      url: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=Sara+Wilson'
    },
    {
      name: 'Mike Johnson',
      url: 'https://via.placeholder.com/300/FFFF00/FFFFFF?text=Mike+Johnson'
    }
  ]);

  const childRefs = useRef(people.map(() => React.createRef()));

  const swiped = (direction, nameToDelete) => {
    console.log('Removing: ' + nameToDelete);
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  // const swipe = (dir) => {
  //   const cardsLeft = people.filter(person => person.name !== people[0].name);
  //   if (cardsLeft.length) {
  //     const toBeRemoved = people[0].name; // Find the card object to be removed
  //     const index = people.map(person => person.name).indexOf(toBeRemoved); // Find the index of the card object to be removed
  //     childRefs.current[index].current.swipe(dir); // Swipe the card!
  //   }
  // };
  const swipe = (dir) => {
    if (people.length > 0) {
      const currentIndex = people.length - 1;
      const cardRef = childRefs.current[currentIndex];
      if (cardRef && cardRef.current) {
        cardRef.current.swipe(dir); // Swipe the card!
      }
    }
  };

  const handleSwipeLeft = () => {
    swipe('left');
  };

  const handleSwipeRight = () => {
    swipe('right');
  };

  return (
    <div className="swipeDisplay">
      <div className='swipeButtons__left' onClick={handleSwipeLeft}>
      Swipe Left
    </div> 
    <div className='tinderCards'>
    
    <div className='tinderCards__cardContainer'>
      {people.map((person, index) => (
        <TinderCard
          ref={childRefs.current[index]}
          className='swipe'
          key={person.name}
          onSwipe={(dir) => swiped(dir, person.name)}
          onCardLeftScreen={() => outOfFrame(person.name)}
          preventSwipe={['up', 'down']}
        >
          <div
            style={{ backgroundImage: `url(${person.url})` }}
            className='card'
          >
            <h3>{person.name}</h3>
          </div>
        </TinderCard>
      ))}
    </div>
   
  </div>
  <div className='swipeButtons__right' onClick={handleSwipeRight}>
   Swipe Right
 </div>
 
 </div>
);
};

export default TinderCards;
