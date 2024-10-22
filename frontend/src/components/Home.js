import React from 'react';
import './Home.css';
import MapArea from './MapArea';  // Import the map component

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      {/* Main Content Area */}
      <div className="main-content">
        {/* Graph Section */}
        <div className="graph-section">
          <h4>Customized search</h4>
          <div className="graph-placeholder">
            {/* Include the MapArea component here */}
            <MapArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
