import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useQuery } from 'react-query';

const fetchJobById = async (jobId, token) => {
  const response = await axios.get(`http://localhost:3000/api/manager/jobs/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include token in the header
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch job details');
  }

  return response.data;
};

export const useJobById = (jobId) => {
    const { token } = useAuth();
  
    return useQuery(['job', jobId, 'details'], () => fetchJobById(jobId, token), {
      enabled: !!jobId, // Query will be enabled only if jobId is provided
    });
  };
