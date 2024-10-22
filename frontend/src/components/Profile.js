import React, { useEffect, useState } from 'react';
import getProfile from '../services/getProfile';  // Import the getProfile function

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Add a loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();  // Fetch profile using getProfile service
        setProfile(profileData);  // Set profile data into state
      } catch (error) {
        setError(error.message);  // Capture and display error message
      } finally {
        setLoading(false);  // Stop loading regardless of success or error
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show a loading indicator while fetching data
  }

  if (error) {
    return <div>{error}</div>;  // Display any error messages
  }

  return (
    <div>
      <h1>Profile</h1>
      {profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {/* Display other profile details here */}
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;
