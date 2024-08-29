import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/auth';

const fetchApplicants = async (applicantIds, token) => {
  const response = await axios.get('http://localhost:3000/api/manager/applicants', {
    params: { ids: applicantIds },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch applicants');
  }

  return response.data;
};

export const useApplicants = (applicantIds) => {
  const { token } = useAuth();
  
  return useQuery(
    ['applicants', applicantIds],
    () => fetchApplicants(applicantIds, token), // Pass the token here
    {
      enabled: !!applicantIds.length,
    }
  );
};