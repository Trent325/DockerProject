import { useAuth } from '../context/auth';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchJobs = async (token) => {
  const response = await axios.get('http://localhost:3000/api/applicant/jobs', {
    headers: {
      'Authorization': `Bearer ${token}`, // Include token in the header
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
