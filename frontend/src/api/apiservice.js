import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/users',
    timeout: 10000, // Timeout if needed
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const registerUser = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  