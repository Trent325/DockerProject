import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [userData, setUserData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [haveProfile, setHaveProfile] = useState(false);
  const [name, setName] = useState(userData?.name || " ");
  const [school, setSchool] = useState(userData?.school || " ");
  const [degree, setDegree] = useState(userData?.degree || " ");
  const [resume, setResume] = useState(userData?.resume || null);
  const [resumeUrl, seetResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("Upload Resume (PDF)");
  const [reload, setReload] = useState(false);
  const { token } = useAuth();
  const decoded = jwtDecode(token);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/applicant/applicant/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the header
            },
          }
        );
        setUserData(data);

        if (data.school !== undefined) {
          setName(data.name);
          setSchool(data.school);
          const byteArray = new Uint8Array(data.resume?.data.data);
          const blob = new Blob([byteArray], { type: data.resume.contentType });
          const url = URL.createObjectURL(blob);
          seetResumeUrl(url);
          setDegree(data.degrees[0]);
          setHaveProfile(true);
        }
        setLoading(false);
      } catch (e) {
        setLoading(true);
        console.log(e);
      }
    }
    fetchData();
  }, [reload]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("school", school);
    formData.append("degrees", degree);
    formData.append("id", decoded.id);
    if (resume) {
      formData.append("resume", resume);
    }

    const response = await fetch(
      "http://localhost:3000/api/applicant/profile",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (response.ok) {
      console.log("Sucess!!!!!");
      setTimeout(() => {
        setReload(!reload);
      }, 500);
    } else {
      const errorData = await response.json();
      console.error("Error submitting form data:", errorData);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setResumeFileName(file.name);
    } else {
      console.log("something went wrong with resume");
      setResume(null);
      setResumeFileName("resume.pdf");
    }
  };

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  return (
    <>
      <div className="user-profile-page">
        <div className="container">
          {!haveProfile ? (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <h1 className="profile-heading">User Profile</h1>
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="input-group">
                <label>School</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="School"
                />
              </div>
              <div className="input-group">
                <label>Degree</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="Degree"
                />
              </div>
              <div className="input-group">
                <label>Resume</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                />
                <p>{resumeFileName}</p>
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setHaveProfile(true)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profiledetails container">
              <div className="banner ">
                <h3>Profile</h3>
                <div className="detail">
                  <strong>Name:</strong> <span>{name}</span>
                </div>
                <div className="detail">
                  <strong>School:</strong> <span>{school}</span>
                </div>
                <div className="detail">
                  <strong>Degree:</strong> <span>{degree}</span>
                </div>
                <iframe
                  src={resumeUrl}
                  style={{ width: "100%", height: "400px" }}
                  title="PDF Viewer"
                ></iframe>
                <div className="makeCenter">
                  <button
                    className="update-button"
                    onClick={() => setHaveProfile(false)}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
