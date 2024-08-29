import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const AcceptedApplicantCard = ({ applicant, jobId }) => {

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
      </CardContent>
    </Card>
  );
};

export default AcceptedApplicantCard;
