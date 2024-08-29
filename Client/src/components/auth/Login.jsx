import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState("applicant");
  const navigate = useNavigate();
  const { setToken, setRole } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, role: roles }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed");
        return;
      }
  
      // Parse the response JSON
      const data = await response.json();
      const { token, role } = data;
  
      setToken(token);
      setRole(role);
  
      // Redirect based on role
      if (role === "hiringManager") {
        navigate("/hiringManager"); // Redirect to admin dashboard
      } else {
        navigate("/jobList"); // Redirect to user dashboard
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  return (
    <Container className="bg-white">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center my-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicRole" className="mb-3">
              <Form.Label className="block text-center mb-2">Role</Form.Label>
              <div className="flex flex-col items-center space-y-2">
                <Form.Check
                  type="radio"
                  id="roleApplicant"
                  label="Applicant"
                  name="role"
                  value="applicant"
                  checked={roles === "applicant"}
                  onChange={(e) => setRoles(e.target.value)}
                  className="mx-2"
                />
                <Form.Check
                  type="radio"
                  id="roleHiringManager"
                  label="Hiring Manager"
                  name="role"
                  value="hiringManager"
                  checked={roles === "hiringManager"}
                  onChange={(e) => setRoles(e.target.value)}
                  className="mx-2"
                />
                <Form.Check
                  type="radio"
                  id="roleAdmin"
                  label="Admin"
                  name="Admin"
                  value="admin"
                  checked={roles === "admin"}
                  onChange={(e) => setRoles(e.target.value)}
                  className="mx-2"
                />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>

            <div className="text-center mt-3">
              <Link to="/register">Create an account</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
