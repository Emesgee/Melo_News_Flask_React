// src/components/TopBar.js
import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="topbar">
      <input type="text" placeholder="Search..." className="search-input" />
    </div>
  );
};

export default TopBar;
