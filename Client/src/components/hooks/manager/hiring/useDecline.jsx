import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../../context/auth';

const declineApplicant = async ({ jobId, applicantId, token }) => {
  const response = await axios.put(`http://localhost:3000/api/manager/jobs/${jobId}/applicants/${applicantId}/decline`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to decline applicant');
  }

  return response.data;
};

export const useDeclineApplicant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    ({ jobId, applicantId }) => declineApplicant({ jobId, applicantId, token }),
    {
      onSuccess: () => {
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries('applicants');
        queryClient.invalidateQueries('jobs');
        queryClient.invalidateQueries('job');
      },
    }
  );
};
