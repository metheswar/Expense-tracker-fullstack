import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // TODO: Implement the logic to send a password reset link to the provided email
    // This will involve making a request to your server.

    // Example:
    // const response = await fetch('http://localhost:3001/forgotpassword', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email }),
    // });

    // if (response.ok) {
    //   console.log('Password reset link sent successfully!');
    // } else {
    //   console.error('Failed to send reset link. Please try again.');
    // }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h1 className="text-center">Forgot Password</h1>
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
