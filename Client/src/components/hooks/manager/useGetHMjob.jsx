import { useAuth } from '../../context/auth';
import axios from 'axios';
import { useQuery } from 'react-query';

function parseJwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  
  const fetchJobs = async (token) => {
    // Decode the token manually
    const decodedToken = parseJwt(token);
    const userId = decodedToken.id; // Assuming the ID is stored in the "id" field
  
    // Make the POST request and include the user ID in the body
    const response = await axios.get(`http://localhost:3000/api/manager/jobs?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in the header
        'Content-Type': 'application/json',
      },
    });
  
    if (response.status !== 200) {
      throw new Error('Failed to fetch jobs');
    }
  
    return response.data;
  };

export const useJobs = () => {
  const { token } = useAuth();

  return useQuery('jobs', () => fetchJobs(token));
};
