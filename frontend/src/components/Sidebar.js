import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar open/close
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle logout by clearing the token and redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Icon at top left, only visible when sidebar is closed */}
      {!isOpen && (
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Minimize button inside the sidebar */}
        {isOpen && (
          <button className="minimize-btn" onClick={toggleSidebar}>
            ✕
          </button>
        )}
        <ul>
          <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
          <li><Link to="/upload" onClick={toggleSidebar}>Create News</Link></li>
          <li><Link to="/about" onClick={toggleSidebar}>About</Link></li>
          <li><Link to="/users" onClick={toggleSidebar}>Profile</Link></li>
          <li><Link to="/training" onClick={toggleSidebar}>Training</Link></li>
          <li><button onClick={() => { handleLogout(); toggleSidebar(); }} className="logout-btn">Log out</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
