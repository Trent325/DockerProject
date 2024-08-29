import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/auth';

function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  
  return JSON.parse(jsonPayload);
}

export const usePostJob = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const postJob = async (jobData) => {
    const decodedToken = parseJwt(token);
    const userId = decodedToken.id;

    const requestData = { ...jobData, userId };

    const response = await axios.post('http://localhost:3000/api/manager/jobs', requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) {
      throw new Error('Failed to post job');
    }

    return response.data;
  };

  return useMutation(postJob, {
    onSuccess: () => {
      // Invalidate and refetch jobs query after posting a job
      queryClient.invalidateQueries('jobs');
    },
  });
};
