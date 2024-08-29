import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, CardMedia, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import noImage from '../../assets/noimage.jpg';
import { useDeleteJob } from '../hooks/manager/useDeleteJob';
import { useUpdateJob } from '../hooks/manager/useUpdatejob';

const JobCard = ({ job }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });
  const { mutate: deleteJob } = useDeleteJob();
  const { mutate: updateJob } = useUpdateJob();

  const handleClickOpenDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
  };

  const handleClickOpenEdit = () => {
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteJob(job._id);
      handleCloseDelete(); // Close the modal after deletion
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleChange = (e) => {
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    try {
      await updateJob(editedJob);
      handleCloseEdit(); // Close the modal after update
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  return (
    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} key={job._id}>
      <Card
        sx={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          marginTop: 5,
          boxShadow:
            '0 15px 30px rgba(0,0,0,0.30), 0 10px 8px rgba(0,0,0,0.22);',
          textDecoration: 'none',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            minWidth: '40px',
            maxWidth: '250px',
            objectFit: 'cover',
            minHeight: '40px',
          }}
          image={noImage}
          alt="No Image here"
        />
        <CardContent
          sx={{ marginLeft: '50px', textAlign: 'left', color: 'black' }}
        >
          <Link
            className="Link-for-eventcard"
            to={`/jobdetails/${job._id}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Category: {job.category}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Location: {job.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date: {job.postDate}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Salary: {job.salary}
            </Typography>
          </Link>
          <IconButton
            onClick={handleClickOpenEdit}
            sx={{ color: 'blue', marginTop: 2 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleClickOpenDelete}
            sx={{ color: 'red', marginTop: 2 }}
          >
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEdit}>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={editedJob.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={editedJob.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            value={editedJob.location}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Salary"
            name="salary"
            value={editedJob.salary}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={editedJob.category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Post Date"
            name="postDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editedJob.postDate}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default JobCard;
