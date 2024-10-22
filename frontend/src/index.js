import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router
import App from './App';  // Import App

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);