import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import "./AdminDashboard.css"; // Import the new CSS file for styling

const AdminDashboard = () => {
  const [hiringManagers, setHiringManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchHiringManagers = async () => {
      try {
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          console.error("No token found in localStorage");
          return;
        }

        console.log("Token being sent in request header:", token); // Log token

        const response = await axios.get(
          "http://localhost:3000/api/admin/hiring-managers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response from backend:", response); // Log entire response object

        setHiringManagers(response.data);
        setFilteredManagers(response.data); // Initialize filteredManagers with full data
        console.log("Hiring managers fetched successfully:", response.data);
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          setError(
            `Failed to fetch hiring managers: ${
              error.response.data.message || error.response.status
            }`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          setError("No response from server. Check your network.");
        } else {
          console.error("Error setting up request:", error.message);
          setError("Error setting up request.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHiringManagers();
  }, [token]); // Add token as a dependency to useEffect

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      // If search query is empty, show all hiring managers
      setFilteredManagers(hiringManagers);
    } else {
      // Filter hiring managers based on the search query
      const filtered = hiringManagers.filter((manager) =>
        manager.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredManagers(filtered);
    }
  };

  const handleApprove = async (id) => {
    try {
      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      await axios.patch(
        `http://localhost:3000/api/admin/hiring-managers/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHiringManagers((prev) =>
        prev.map((manager) =>
          manager._id === id ? { ...manager, isApproved: true } : manager
        )
      );

      setFilteredManagers((prev) =>
        prev.map((manager) =>
          manager._id === id ? { ...manager, isApproved: true } : manager
        )
      );

      console.log("Hiring manager approved successfully");
    } catch (error) {
      console.error("Error approving manager:", error);
      setError("Failed to approve manager");
    }
  };

  const handleDeny = async (id) => {
    try {
      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/admin/hiring-managers/${id}/deny`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHiringManagers((prev) => prev.filter((manager) => manager._id !== id));
      setFilteredManagers((prev) =>
        prev.filter((manager) => manager._id !== id)
      );

      console.log("Hiring manager denied successfully");
    } catch (error) {
      console.error("Error denying manager:", error);
      setError("Failed to deny manager");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search hiring managers..."
          value={searchQuery}
          onChange={handleSearchChange} // Update on change
        />
      </div>
      <div className="hiring-managers-grid">
        {filteredManagers.length === 0 ? (
          <p>No hiring managers found.</p>
        ) : (
          filteredManagers.map((manager) => (
            <div className="hiring-manager-card" key={manager._id}>
              <div className="hiring-manager-info">
                <h3>{manager.username}</h3>
                <p>{manager.email}</p>
                <span
                  className={`status-badge ${
                    manager.isApproved ? "approved" : "pending"
                  }`}
                >
                  {manager.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="action-buttons">
                {!manager.isApproved && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(manager._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="deny-btn"
                      onClick={() => handleDeny(manager._id)}
                    >
                      Deny
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
