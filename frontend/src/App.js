import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import Profile from './components/Profile';
import Upload from './components/Upload';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import './App.css';  // Import any necessary CSS

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));  // Track login state
  const location = useLocation();  // Get current location (for conditional Sidebar)
  const navigate = useNavigate();

  // Define routes where the sidebar should not be visible
  const noSidebarRoutes = ['/login', '/register'];  // Hide sidebar on login and register pages

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');  // Redirect to login if not logged in
      }
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate, location.pathname]);

  return (
    <div className="App">
      {/* Conditionally render Sidebar if the current route is not in noSidebarRoutes */}
      {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}

      <Routes>
        {/* Redirect '/' to '/home' if logged in, otherwise to '/login' */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        {/* Redirect '/login' to '/home' if logged in */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <UserLogin setIsLoggedIn={setIsLoggedIn} />} />
        {/* Redirect '/register' to '/home' if logged in */}
        <Route path="/register" element={isLoggedIn ? <Navigate to="/home" /> : <UserRegistration />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/upload" element={isLoggedIn ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      </Routes>

      {/* Navigation for login/logout */}
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

// Navigation component handling login/logout
function Navigation({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear the token
    setIsLoggedIn(false);  // Update login state
    navigate('/login');  // Redirect to login
  };

  return (
    <nav>
      {isLoggedIn ? (
        <h1></h1>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </nav>
  );
}

export default App;
