import React ,{ useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./FandomPage.css";
import Navbar from "./Navbar";
const FandomPage = () => {
    const [merchandise, setMerchandise] = useState([]);

    useEffect(() => {
      fetch('http://localhost:5001/fandomoutfits')
        .then(response => response.json())
        .then(data => setMerchandise(data))
        .catch(error => console.error('Error fetching merchandise:', error));
    }, []);
    return(
    <>
    <Navbar />
    <div className="FandomCards">
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
  </div> 
  </>
)};

export default FandomPage;