import React from 'react';
import { Card, CardContent, Grid, Typography, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import noImage from '../../assets/noimage.jpg';

const AppliedCard = ({ job }) => {
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
                    <Typography variant="h5" component="h1" gutterBottom>
                        Title: {job.title}
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
                </CardContent>
            </Card>
        </Grid>
    );
};

export default AppliedCard;