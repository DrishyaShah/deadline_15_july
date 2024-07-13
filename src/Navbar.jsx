
//import './Navbar.css';
//import logo from './logo.png'; // Add your logo file path

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Badge, Button } from '@mui/material';
import { Search as SearchIcon, AccountCircle, FavoriteBorder, ShoppingBagOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom'

const Navbar = () => {
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
            <Typography key={item} variant="body1" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {item}
            </Typography>
          ))}
        </Box>

        {/* Search Bar and Upload Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 1, px: 4 }}>
          <IconButton size="large">
            <SearchIcon />
          </IconButton>
          <InputBase placeholder="Search for products, brands and more" inputProps={{ 'aria-label': 'search' }} />
          
        </Box>
        <Link to="/orders"> 
        <Button variant="contained"  sx={{ ml: 2, backgroundColor: '#ff3f6c', '&:hover': { backgroundColor: '#e3355d' } }}>
            Upload to Instagram
          </Button>
        </Link>
        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="large">
            <AccountCircle />
          </IconButton>
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
