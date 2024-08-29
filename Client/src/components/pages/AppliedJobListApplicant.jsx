import React, { useState, useEffect, useContext } from "react";
import { Grid, } from "@mui/material";   
import AppliedCard from "../jobList/AppliedCard";
import axios from "axios";
import { useAuth } from '../context/auth';
import { jwtDecode  } from 'jwt-decode';



const AppliedJobListApplicant = () => {
    const [loading, setLoading] = useState(true);
    const [jobsData, setJobsData] = useState(undefined);
    const { token } = useAuth();
    const decoded = jwtDecode(token);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const id = "66ce3121c8f7edf6cc323604"
            const {data} = await axios.get(`http://localhost:3000/api/applicant/applied-jobs/${decoded.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`, // Include token in the header
                },
            });
            setJobsData(data);
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(true);
          }
        };
        fetchData();
      },[]);

    
    if (loading) {
        return <h1>Loading.....</h1>;
    }

    return (
        <>
          <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <h2>Applied Jobs</h2>
          </div>
          <Grid
            container
            spacing={1}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '100px',
            }}
          >
            {jobsData?.appliedJobs.map((job) => (
              <AppliedCard key={job._id} job={job} />
            ))}
          </Grid>
        </>
      );
};

export default AppliedJobListApplicant;
