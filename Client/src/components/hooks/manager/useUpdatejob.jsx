import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/auth';

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation(
    async (job) => {
      const response = await axios.put(`http://localhost:3000/api/manager/jobs/${job._id}`, job, {headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate the `GET` request to refresh the job list
        queryClient.invalidateQueries('jobs');
      },
    }
  );
};