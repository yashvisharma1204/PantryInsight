// src/components/Filter.js

import React from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const Filter = ({ categories, currentCategory, onCategoryChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    handleClose();
  };

  return (
    <div>
      <IconButton
        edge="start"
        aria-label="filter"
        onClick={handleClick}
        sx={{ color: '#0A6847' }}
      >
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleCategorySelect('')}>All Categories</MenuItem>
        {categories.map((category, index) => (
          <MenuItem
            key={index}
            selected={currentCategory === category}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Filter;
