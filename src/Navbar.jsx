
//import './Navbar.css';
//import logo from './logo.png'; // Add your logo file path

import React ,{useState,useEffect} from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Badge, Button, Tooltip} from '@mui/material';
import { Search as SearchIcon, AccountCircle, FavoriteBorder, ShoppingBagOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [points, setPoints] = useState(0);
  useEffect(() => {
    // Fetch user points
    fetch(`http://localhost:5001/get-likes`)
      .then(response => response.json())
      .then(data => setPoints(data.points))
      .catch(error => console.error('Error fetching user points:', error));
  }, []);
  console.log(points);
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-myntra-2709168-2249158.png?f=webp&w=256 " alt="Logo" style={{ height: 40 }} />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {['MEN', 'WOMEN', 'KIDS', 'HOME & LIVING', 'BEAUTY', 'STUDIO NEW'].map((item) => (
            <Typography key={item} variant="body1" sx={{ cursor: 'pointer', fontFamily: 'Assistant', fontWeight: 'bold' }}>
              {item}
            </Typography>
          ))}
        </Box>

        {/* Search Bar and Upload Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', fontFamily: 'Assistant', borderRadius: 1, px: 4 }}>
        
          <IconButton size="large">
            <SearchIcon />
          </IconButton>
         
          <InputBase placeholder="Search for products, brands and more" inputProps={{ 'aria-label': 'search',fontFamily: 'Assistant' }} />
          
        </Box>
        <Link to="/orders"> 
        <Button variant="contained"  sx={{ ml: 2, backgroundColor: '#ff3f6c', fontFamily: 'Assistant', '&:hover': { backgroundColor: '#e3355d' } }}>
            Upload to Instagram
          </Button>
        </Link>
        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={`Points: ${points}`} arrow componentsProps={{
              tooltip: {
                sx: {
                  fontFamily: 'Assistant',
                  fontSize: '1.2em', // Increase font size
                  padding: '10px 20px', // Increase padding
                  backgroundColor: 'rgba(0, 0, 0, 0.87)', // Tooltip background color
                  color: '#fff', // Tooltip text color
                },
              },
            }}>
          <IconButton size="large">
            <AccountCircle />
          </IconButton>
          </Tooltip>
          <IconButton size="large">
            <Badge badgeContent={4} sx={{ '& .MuiBadge-badge': { backgroundColor: '#ff3f6c',color:'white' } }}>
              <FavoriteBorder />
            </Badge>
          </IconButton>
          <IconButton size="large">
            <Badge badgeContent={2} sx={{ '& .MuiBadge-badge': { backgroundColor: '#ff3f6c', color:'white' } }}>
              <ShoppingBagOutlined />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
