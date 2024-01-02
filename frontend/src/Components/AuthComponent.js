import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginHandler, premiumHandler } from '../store/authSlice';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addExpense } from '../store/expenseSlice';

const AuthComponent = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/getExpense', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching expenses: ${response.statusText}`);
      }

      const expensesData = await response.json();

      dispatch(addExpense(expensesData));
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!validateEmail(username)) {
        setError('Invalid email format');
        return;
      }

      const endpoint = 'http://localhost:3001/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

    
        const responseData = await response.json();

        if (responseData.message === true) {
          dispatch(loginHandler());
          console.log('Login Successful');
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('email', responseData.user.email);
          dispatch(premiumHandler(responseData.user.premium))
          fetchExpenses();
        } else {
          setError(responseData.error);
        }
     
    } catch (error) {
      console.error('Error during login:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!validateEmail(username) || !validatePassword(password)) {
        setError('Invalid email or password format');
        return;
      }

      const endpoint = 'http://localhost:3001/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: username,
          password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setSignupSuccess(true);
        setTimeout(() => setSignupSuccess(false), 5000);
      } else {
        console.error('Signup failed');
        setError('Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Internal Server Error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h1 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {signupSuccess && <Alert variant="success">Signup successful! You can now login.</Alert>}
          <Form onSubmit={isLogin ? handleLogin : handleSignup}>
            {isLogin ? null :  <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
              />
            </Form.Group>}
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Text className="text-muted">
                Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </Form>
          <p className="mt-3 text-center" onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthComponent;
