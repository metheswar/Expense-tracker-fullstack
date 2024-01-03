import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null); // { type: 'success' or 'error', message: 'alert message' }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const api = 'http://localhost:3001/password/reset';

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // Read the response body once

      if (data.success === true) {
        setAlert({ type: 'success', message: 'Password reset link sent successfully!' });
      } else {
        setAlert({ type: 'error', message: `Failed to send reset link. ${data.message}` });
      }
    } catch (error) {
      setAlert({ type: 'error', message: `Error: ${error.message}` });
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h1 className="text-center">Forgot Password</h1>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{ cursor: 'pointer' }}
            >
              Send Reset Link
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
