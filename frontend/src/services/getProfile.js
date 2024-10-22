const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found, please log in.');
  }

  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const profileData = await response.json();
      console.log('Profile Data:', profileData);
      return profileData; // Return the fetched profile data
    } else if (response.status === 401) {
      // Handle unauthorized error specifically (token may be invalid or expired)
      throw new Error('Unauthorized: Token may be expired or invalid. Please log in again.');
    } else {
      // Handle all other HTTP errors
      const errorData = await response.json(); // Assuming the backend sends error details
      throw new Error(errorData.message || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error; // Rethrow the error so the calling function can handle it
  }
};

export default getProfile;
