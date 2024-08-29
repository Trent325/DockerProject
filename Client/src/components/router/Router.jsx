import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Navbar from "../nav/NavBar";
import Login from "../auth/Login";
import Register from "../auth/Register";
import JobListpage from "../pages/JobListApplicant";
import AuthRoute from "../context/route";
import AppliedJobListApplicant from "../pages/AppliedJobListApplicant";
import JobDetail from "../pages/JobDetail";
import Profile from "../pages/Profile";
import Manager from "../pages/JobListHiring";
import JobDetails from "../pages/JobDetails";
import AdminDashboard from "../admin/AdminDashboard";

const RouterApp = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/jobList" element={<AuthRoute element={JobListpage} />} />
        <Route
          path="/appliedJobList"
          element={<AuthRoute element={AppliedJobListApplicant} />}
        />
        <Route path="/profile" element={<AuthRoute element={Profile} />} />
        <Route
          path="/hiringManager"
          element={<AuthRoute element={Manager} />}
        />
        <Route
          path="/jobdetails/:jobId"
          element={<AuthRoute element={JobDetails} />}
        />
        <Route
          path="/jobdetailsapp/:id"
          element={<AuthRoute element={JobDetail} />}
        />
        <Route path="*" element={<NotFound />} />
        {/* Admin Routes */}
        <Route
          path="/admin-panel"
          element={<AuthRoute element={AdminDashboard} />}
        />

        {/* Catch-All Route for 404 */}
      </Routes>
    </Router>
  );
};

export default RouterApp;
