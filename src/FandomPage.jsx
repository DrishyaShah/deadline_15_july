import React ,{ useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./FandomPage.css";
import Navbar from "./Navbar";
const FandomPage = () => {
    const [merchandise, setMerchandise] = useState([]);
    const [points, setPoints] = useState(0);

    const UserName="Diya Shah"
    useEffect(() => {
      // Fetch user points //If logging with insta from beginning, then call get-likes route
    fetch(`http://localhost:5001/get-likes`)//http://localhost:5001/userpoints/${encodeURIComponent(UserName)}
    .then(response => response.json())
    .then(data => setPoints(data.points))
    .catch(error => console.error('Error fetching user points:', error));

    //Fetch merchandise
      fetch('http://localhost:5001/fandomoutfits')
        .then(response => response.json())
        .then(data => setMerchandise(data))
        .catch(error => console.error('Error fetching merchandise:', error));
    }, []);
     console.log(points);
    // Function to calculate the discounted price
  const calculateDiscountedPrice = (originalPrice) => {
    const discount = points * 0.01; // Example: 1 point = 1% discount
    const discountedPrice = originalPrice - (originalPrice * discount);
    return Math.max(discountedPrice, 0); // Ensure price doesn't go negative
  };

    const groupedMerchandise = merchandise.reduce((acc, item) => {
      if (!acc[item.fandom]) {
        acc[item.fandom] = [];
      }
      acc[item.fandom].push(item);
      return acc;
    }, {});
    console.log(groupedMerchandise);
      // Sort the grouped merchandise keys (fandom names) by date in descending order
  const sortedFandoms = Object.keys(groupedMerchandise).sort((a, b) => {
    const dateA = new Date(groupedMerchandise[a][0].uploaddate);
    const dateB = new Date(groupedMerchandise[b][0].uploaddate);
    return dateB - dateA;
  });
  console.log(sortedFandoms);
    return(
    <>
    <Navbar />
    {/* <div className="FandomCards">
    {merchandise.map(item => (
          <div className="card-fandom" key={item.outfitId}>
            <img src={item.img} alt={item.fandom} />
            <div className="info">
              <h3>{item.fandom}</h3>
              <p>{item.price}</p>
              <button>Visit</button>
            </div>
          </div>
        ))}
  </div>  */}
  <div className="FandomCards">
        {sortedFandoms.map(fandom => (
          <div key={fandom}>
            <h2>{fandom}</h2>
            <div className="category-cards">
              {groupedMerchandise[fandom].map(item => (
                <div className="card-fandom" key={item.outfitId}>
                  <img src={item.img} alt={item.fandom} />
                  <div className="info">
                    <h3>{item.fandom}</h3>
                    <p>Original Price: {item.price}</p>
                    <p>Discounted Price: {calculateDiscountedPrice(item.price)}</p>
                    <button>Visit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  </>
)};

export default FandomPage;