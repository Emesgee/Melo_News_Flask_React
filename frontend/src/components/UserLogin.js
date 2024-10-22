import React, { useState, useEffect } from 'react';
import './UserLogin.css';  // Import the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  // Check if the user is logged in by checking if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', result.access_token);  // Save the token
        setIsLoggedIn(true);  // Update the login state
        
        // Wait for 3 seconds and then redirect to the homepage
        setTimeout(() => {
          navigate('/Home');  // Redirect to home page after 3 seconds
        }, 6000);
      } else {
        setMessage(result.message || 'An error occurred.');
      }
    } catch (error) {
      setMessage('An error occurred while trying to log in.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');  // Redirect to the register page
  };

  return (
    <div className="signin-container">
      <div className="left-panel">
        {/* The background image will be applied via CSS here */}
      </div>
      <div className="right-panel">
        <div className="signin-box">
          {isLoggedIn ? (
            <>
              <h2>Welcome!!</h2>
              <h3>if a troublemaker brings you news, check it first, in case you wrong others unwittingly and later regret what you have done
                 (Quran 49:6-8)
              </h3>
              <p>{message}</p>
            </>
          ) : (
            <>
              <h2>Sign in</h2>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="signin-btn">Sign In</button>
                <p>Don't have an account yet, then click on Register to become a Redot!</p>
                <button onClick={handleRegisterRedirect} className="register-btn">Register</button>  {/* Register button */}
              </form>
            </>
          )}

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
