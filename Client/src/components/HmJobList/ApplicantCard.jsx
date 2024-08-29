import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useAcceptApplicant } from '../hooks/manager/hiring/useAccept';
import { useDeclineApplicant } from '../hooks/manager/hiring/useDecline';
import { useAuth } from '../context/auth';

// Fetch the PDF file from the server
const fetchResumeUrl = async (applicantId, token) => {
  try {
    const response = await fetch(`http://localhost:3000/api/manager/resume/${applicantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the provided token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }

    // Create a URL for the Blob data
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
};

const ApplicantCard = ({ applicant, jobId }) => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeError, setResumeError] = useState(false);
  const { mutate: acceptApplicant, isLoading: isAccepting } = useAcceptApplicant();
  const { mutate: declineApplicant, isLoading: isDeclining } = useDeclineApplicant();
  const { token } = useAuth(); // Get the token from useAuth

  useEffect(() => {
    const getResumeUrl = async () => {
      if (applicant._id && token) {
        const url = await fetchResumeUrl(applicant._id, token);
        if (url) {
          setResumeUrl(url);
          setResumeError(false);
        } else {
          setResumeError(true);
        }
      }
    };

    getResumeUrl();
  }, [applicant._id, token]); // Include token in dependency array

  const handleAccept = () => {
    acceptApplicant({ jobId, applicantId: applicant._id });
  };

  const handleDecline = () => {
    declineApplicant({ jobId, applicantId: applicant._id });
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 15px 30px rgba(0,0,0,0.30), 0 10px 8px rgba(0,0,0,0.22);',
        padding: 2,
      }}
    >
      <CardContent>
        <Typography variant="body1" gutterBottom>
          <b>{applicant.username}</b>
        </Typography>
        <Typography variant="body1" gutterBottom>
          School: {applicant.school || 'N/A'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Degrees: {applicant.degrees ? applicant.degrees.join(', ') : 'N/A'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Resume: {applicant.resume ? 'Available' : 'Not Provided'}
        </Typography>
        {resumeError ? (
          <Typography variant="body2" gutterBottom>
            Resume not available or failed to load.
          </Typography>
        ) : resumeUrl ? (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2" gutterBottom>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </Typography>
            <iframe
              src={resumeUrl}
              width="100%"
              height="500px"
              title="Resume"
              style={{ border: 'none' }}
              onError={() => setResumeError(true)} // Handle iframe load error
            />
          </Box>
        ) : (
          <Typography variant="body2" gutterBottom>
            Loading resume...
          </Typography>
        )}
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleAccept}
          disabled={isAccepting || isDeclining} // Disable during any mutation
        >
          {isAccepting ? 'Accepting...' : 'Accept'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDecline}
          disabled={isDeclining || isAccepting} // Disable during any mutation
        >
          {isDeclining ? 'Declining...' : 'Decline'}
        </Button>
      </Box>
    </Card>
  );
};

export default ApplicantCard;
