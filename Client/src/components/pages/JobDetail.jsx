import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { jwtDecode } from "jwt-decode";

const JobDetail = () => {
  const { id } = useParams();
  const location2 = useLocation();
  const { title, category, location, postDate, salary, description } =
    location2.state || {};
  const navigate = useNavigate();
  const { token } = useAuth();
  const decoded = jwtDecode(token);

  useEffect(() => {}, []);

  const ApplyFunction = async (applicantId, jobId) => {
    try {
      const data = { applicantId: applicantId, jobId: jobId };

      const response = await fetch(
        "http://localhost:3000/api/applicant/apply",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log("Sucess!!!!!");
        setTimeout(() => {
          navigate("/jobList");
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("Error submitting form data:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

    return (
        <section className="jobDetail page">
            <div className="container">
                <h3>Job Details</h3>
                <div className="banner">
                    <p>
                        Title: <span> {title}</span>
                    </p>
                    <p>
                        Category: <span>{category}</span>
                    </p>
                    <p>
                        Description: <span>{description}</span>
                    </p>
                    <p>
                        Location: <span>{location}</span>
                    </p>
                    <p>
                        Job Posted On: <span>{postDate}</span>
                    </p>
                    <p>
                        Expected Salary: <span>{salary}</span>
                    </p>
                    <div
                        style={{
                            marginTop: "15px",
                            justifyContent: "center",
                            display: "flex",
                        }}
                    >

            <Button
              variant="contained"
              onClick={() => {
                ApplyFunction(decoded.id, id);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetail;
