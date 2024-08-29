import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }), // Include role in request
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now log in.');
        navigate('/'); // Redirect to the login page
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred');
      console.error(error);
    }
  };

  return (
    <Container className='bg-white'>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center my-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  checked={role === 'applicant'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mx-2"
                />
                <Form.Check
                  type="radio"
                  id="roleHiringManager"
                  label="Hiring Manager"
                  name="role"
                  value="hiringManager"
                  checked={role === 'hiringManager'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mx-2"
                />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
