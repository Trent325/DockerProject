import React, { useState } from 'react';
import { Modal, Button, TextField, Typography } from '@mui/material';
import { usePostJob } from '../hooks/manager/useAddJob';

const PostJobModal = ({ open, onClose }) => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    id: '',
    category: '',
    postDate: '',
    salary: '',
  });

  const { mutate: postJob, isLoading, isError, error } = usePostJob();

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postJob(jobData);
    onClose(); // Close the modal after posting the job
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="post-job-modal">
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        maxWidth: '500px', 
        margin: 'auto', 
        marginTop: '100px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Post a New Job
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Job Title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={jobData.category}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Post Date"
            name="postDate"
            type="date"
            value={jobData.postDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Salary"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? 'Posting...' : 'Post Job'}
          </Button>
          {isError && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </form>
      </div>
    </Modal>
  );
};

export default PostJobModal;
