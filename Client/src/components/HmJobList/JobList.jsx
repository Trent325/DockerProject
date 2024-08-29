import React from "react";
import { Grid } from "@mui/material";
import JobCard from "./card";
import { useJobs } from "../hooks/manager/useGetHMjob";
import PostJobModal from "./AddJob";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

const Jobs = () => {
  const { data: jobsData, isLoading, isError, error } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(jobsData)
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <>
      <div
        className="mt-3 mb-3"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h2>Jobs You Are Hiring For.....</h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button variant="primary" onClick={handleOpenModal}>
          Post a New Job
        </Button>
      </div>

      {jobsData?.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>You aren't hiring for any jobs.</h3>
        </div>
      ) : (
        <Grid
          container
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "100px",
          }}
        >
          {jobsData?.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </Grid>
      )}
      <PostJobModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Jobs;
