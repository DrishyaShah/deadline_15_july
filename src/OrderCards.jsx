import React, { useEffect, useState } from 'react';
import './OrderCards.css'; // Create a CSS file for styling
import Navbar from './Navbar'
const OrderCards = () => {
  const [items, setItems] = useState([]);

  // Mock data for purchased items
  const mockData = [
    {
      id: 1,
      image: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1713610626_4368165.jpg?format=webp&w=480&dpr=1.6',
      title: 'Harry Potter Oversized T-shirt',
      price: 'Rs.599',
    },
    {
      id: 2,
      image: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1710934891_8314557.jpg?format=webp&w=480&dpr=1.6 ',
      title: 'Spider Man round neck T-shirt',
      price: 'Rs.999',
    },
    {
      id: 3,
      image: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1714406614_5401114.jpg?format=webp&w=480&dpr=1.3',
      title: 'Breaking Bad back printed T-shirt',
      price: 'Rs.850',
    },
  ];

  useEffect(() => {
    // Fetch data from an API or use mock data
    // Replace this with an actual API call
    setItems(mockData);
  }, []);

  const handlePost = (itemId) => {
    // Handle the post action here
    console.log(`Post item with id: ${itemId}`);
    console.log('Post action triggered');
    window.location.href = 'http://localhost:5001/post';
  };

  return (
    <>
    <Navbar/>
    <h1>My Orders</h1>
    <div className="purchased-items">
      {items.map((item) => (
        <div key={item.id} className="purchased-card">
          <img src={item.image} alt={item.title} className="purchased-card-image" />
          <div className="purchased-card-content">
            <h2>{item.title}</h2>
            <p>{item.price}</p>
            <button onClick={() => handlePost(item.id)}>Post</button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default OrderCards;
