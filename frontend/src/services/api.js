// src/services/api.js

const apiFetch = async (url, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const options = {
      method,
      headers,
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      return data;
    } catch (error) {
      console.error('Error in API call:', error.message);
      throw error;
    }
  };
  
  export default apiFetch;
  