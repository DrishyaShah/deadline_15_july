import React, { useState, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './Navbar'

const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#ff3f6c',
            '&:hover': {
              backgroundColor: 'rgba(255, 63, 108, 0.08)',
            },
          },
        },
        track: {
          '&.Mui-checked': {
            backgroundColor: '#ff3f6c',
          },
        },
      },
    },
  },
});

const TinderCards = () => {
  const [people, setPeople] = useState([]);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [loadedIndexes, setLoadedIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [rightSwipedOutfits, setRightSwipedOutfits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(false); // State for toggle switch

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:4000/outfits');
  //       const data = await response.json();
  //       const formattedData = data.map(item => ({
  //         name: 'Outfit', // Use a placeholder name or another field if available
  //         url: item.img
  //       }));
  //       setPeople(formattedData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const fetchRandomPerson = async (toggleState) => {
    try {
      console.log(toggleState);
      setIsLoading(true);
      // let randomIndex;
      // do {
      //   randomIndex = Math.floor(Math.random() * 8090); // Adjust 10 according to your data size
      // } while (loadedIndexes.includes(randomIndex));

      //const response = await fetch(`http://localhost:5001/outfits`);
      const response = await fetch(`http://localhost:5001/outfits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isToggleOn: toggleState })
      });
      const data = await response.json();
      const formattedData = {
        SrNo: data.SrNo,
        name: data.name, // Use a placeholder name or another field if available
        url: data.img,
        tag:data.tag||null,
        tagimg:data.tagimg||null
        
      };
      setCurrentPerson(formattedData);
      //setLoadedIndexes([...loadedIndexes, randomIndex]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  const childRefs = useRef(people.map(() => React.createRef()));

  const swiped = (direction, nameToDelete) => {
    console.log("Removing: " + nameToDelete);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  // const swipe = (dir) => {
  //   const cardsLeft = people.filter(person => person.name !== people[0].name);
  //   if (cardsLeft.length) {
  //     const toBeRemoved = people[0].name; // Find the card object to be removed
  //     const index = people.map(person => person.name).indexOf(toBeRemoved); // Find the index of the card object to be removed
  //     childRefs.current[index].current.swipe(dir); // Swipe the card!
  //   }
  // };
  // 
  // const fetchSimilarOutfits=(item) => 
  // {
  //   recommend(formattedData.name)
  // }
  const fetchRecommendations = async (item) => {
    // Make an API call to fetch recommendations for the right-swiped outfits
    // Example fetch call:
    const response = await fetch('http://localhost:5001/get-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }),
    });
    const data = await response.json();

    console.log('Recommendations:', data);
    // Handle the recommendations data as needed
    
    // Extract item IDs from recommendations
    const recommendedSrNo= data.similar_items.map(recommendation=>recommendation.SrNo);

    // Update swipeorder of recommended items
    await fetch('http://localhost:5001/update-swipeorder-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SrNo: recommendedSrNo, swipeorder: 1 ,tag: item, tagimg:currentPerson.url}),
    });
  };

  const updateSwipeOrder = async (SrNo,swipeorder) => {
    // Make an API call to fetch recommendations for the right-swiped outfits
    // Example fetch call:
    const response = await fetch('http://localhost:5001/update-swipeorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SrNo, swipeorder }),
    });
    // const data = await response.json();

    // console.log('Swipeorder:', data);
    // Handle the recommendations data as needed
  };


  const handleSwipe = async (dir) => {
    let swipeorder=-1;
    
    await updateSwipeOrder(currentPerson.SrNo,swipeorder);
    if (dir === 'right')
    {
      
      setRightSwipeCount(prevCount => prevCount + 1);
      setRightSwipedOutfits([...rightSwipedOutfits, currentPerson]);
      //console.log(currentPerson.name)
      await fetchRecommendations(currentPerson.name);
      if (rightSwipeCount + 1 === 5) {
        setIsModalOpen(true);
        setRightSwipeCount(0)
        // setRightSwipedOutfits([])
      }
    }
    fetchRandomPerson(isToggleOn);
  };

  // useEffect(() => {
  //   fetchRandomPerson(isToggleOn);
  // }, []); 

  const handleSwipeLeft = () => {
    handleSwipe("left");
  };

  const handleSwipeRight = () => {
    handleSwipe("right");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRightSwipedOutfits([])
  };

  // const handleToggle = () => {
  //   console.log(isToggleOn);
  //   setIsToggleOn( isToggleOn=> !isToggleOn);
  //   console.log(isToggleOn);
  // };
  
  const handleToggle = () => {
    setIsToggleOn(prevToggle => !prevToggle); // Use functional form to update state
    fetchRandomPerson(!isToggleOn);
  };
  
  useEffect(() => {
    // Fetch data or perform actions based on toggle state change
    console.log("Toggle state changed:", isToggleOn);
  }, [isToggleOn]); // useEffect hook dependency on isToggleOn state

useEffect(() => {
    fetchRandomPerson(isToggleOn);
  }, [isToggleOn]);

  return (
        <>
        <Navbar/>
       <ThemeProvider theme={theme}>
      <div className="swipeDisplay">
        <div className="toggleContainer">
          <FormControlLabel
            control={
              <Switch
                checked={isToggleOn}
                onChange={handleToggle}
                name="toggleSwitch"
                color='#ff3f6c'
              />
            }
            label={isToggleOn ? "Find Similar On" : "Find Similar Off"}
          />
        </div>
      <div className="swipeButtons__left" onClick={handleSwipeLeft}>
      {/* <ArrowBackIcon /> */}
      <p>Dislike</p>
      </div>
      <div className="tinderCards">
        <div className="tinderCards__cardContainer">
          {/* {people.map((person, index) => (
            <TinderCard
              ref={childRefs.current[index]}
              className="swipe"
              key={person.name}
              onSwipe={(dir) => swiped(dir, person.name)}
              onCardLeftScreen={() => outOfFrame(person.name)}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: `url(${person.url})` }}
                className="card"
              >
                <h3>{person.name}</h3>
              </div>
            </TinderCard>
          ))} */}
          {currentPerson && (
            <TinderCard
              className='swipe'
              key={currentPerson.name} // Ensure unique key for each card
              onSwipe={(dir) => handleSwipe(dir)}
              preventSwipe={['up', 'down']}
            >
              <div
                style={{
                   backgroundImage: `url(${currentPerson.url})`,
                }}
                className='card'
              >
                {/* <img src={currentPerson.url} alt={currentPerson.name} /> */}
                {/* <h3>{currentPerson.name}</h3> */}
              </div>
            </TinderCard>
           
          )}
          {isLoading && <div>Loading...</div>}
          {currentPerson && (<div className="card-name">
            <p>{currentPerson.name}</p>
            {currentPerson.tag && <p>Because you liked:<a href={currentPerson.tagimg}>{currentPerson.tag}</a> </p>}
          </div>)}
          
        </div>
      </div>
      <div className="swipeButtons__right" onClick={handleSwipeRight}>
      {/* <ArrowForwardIcon /> */}
      <p>Like</p>
      </div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="modalBox">
          <h2>Right Swiped Outfits</h2>
          <div className="swipedOutfitsContainer">
            {rightSwipedOutfits.map((outfit, index) => (
              <div key={index} className="swipedOutfit">
                <img src={outfit.url} alt={outfit.name} />
                {/* <h3>{outfit.name}</h3> */}
                <p>Add to wishlist</p>
              </div>
              ))}
              </div>
              <Button onClick={handleCloseModal}>Continue Swiping</Button>
        </Box>

      </Modal>
    </div>
    </ThemeProvider>
    </>
  );
};

export default TinderCards;
