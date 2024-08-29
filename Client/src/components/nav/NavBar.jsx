import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

// Import the new logo
import adpLogo from "../../assets/ADP-logo.png"; // Adjust the path based on your folder structure
import "./NavBar.css"; // Import CSS file for styling

const AppNavbar = () => {
  const navigate = useNavigate();
  const { token, role, setToken, setRole } = useAuth(); // Access the role from the auth context
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    setToken(null);
    setRole(null);

    // Redirect to the home or login page
    navigate("/");
  };

  return (
    <Navbar bg="primary" expand="lg" className="app-navbar">
      <Container>
        {/* Replace text with logo image */}
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          <img
            src={adpLogo}
            alt="ADP Logo"
            className="logo" // Use a CSS class for logo styling
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {isLoggedIn ? (
              <>
                {role === "applicant" && (
                  <>
                    <Nav.Link as={Link} to="/jobList">
                      Job List
                    </Nav.Link>
                    <Nav.Link as={Link} to="/appliedJobList">
                      Applied Jobs
                    </Nav.Link>
                    <Nav.Link as={Link} to="/profile">
                      Profile
                    </Nav.Link>
                  </>
                )}

                {/* Conditional links based on user role */}
                {role === "hiringManager" && (
                  <>
                    <Nav.Link as={Link} to="/hiringManager">
                      Your Jobs
                    </Nav.Link>
                    {/* Add more hiring manager-specific links if needed */}
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Nav.Link as={Link} to="/admin-panel">
                      Admin Panel
                    </Nav.Link>
                    {/* Add more admin-specific links if needed */}
                  </>
                )}

                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
