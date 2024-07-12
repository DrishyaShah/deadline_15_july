import React, { useEffect, useState } from 'react';
import './OrderCards.css'; // Create a CSS file for styling

const OrderCards = () => {
  const [items, setItems] = useState([]);

  // Mock data for purchased items
  const mockData = [
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      title: 'T-shirt 1',
      price: '$20',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      title: 'T-shirt 2',
      price: '$25',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150',
      title: 'T-shirt 3',
      price: '$30',
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
    window.location.href = 'http://localhost:5001';
  };

  return (
    <div className="purchased-items">
      {items.map((item) => (
        <div key={item.id} className="card">
          <img src={item.image} alt={item.title} className="card-image" />
          <div className="card-content">
            <h2>{item.title}</h2>
            <p>{item.price}</p>
            <button onClick={() => handlePost(item.id)}>Post</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCards;
