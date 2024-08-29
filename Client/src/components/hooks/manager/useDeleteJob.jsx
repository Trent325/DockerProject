import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/auth';

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const deleteJob = async (jobId) => {
    const response = await axios.delete(`http://localhost:3000/api/manager/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to delete job');
    }

    return response.data;
  };

  return useMutation(deleteJob, {
    onSuccess: () => {
      // Invalidate and refetch the jobs query to reflect the deleted job
      queryClient.invalidateQueries('jobs');
    },
  });
};