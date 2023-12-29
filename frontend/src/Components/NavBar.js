import React, { useState } from 'react';
import { Navbar, Nav, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { logoutHandler, premiumHandler } from '../store/authSlice';
import { clear } from '../store/expenseSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.authentication.authenticated);
  const premium = useSelector((state) => state.authentication.premium);

  const [showAlert, setShowAlert] = useState(false);

  const onLogout = () => {
    dispatch(clear());
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch(logoutHandler());
  };

  const purchasePremium = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/purchasePremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      const options = {
        key: result.key_id,
        amount: result.order.amount,
        currency: 'INR',
        order_id: result.order.id,
        name: 'Expense Tracker Premium',
        description: 'Purchase Premium',
        image: '',
        handler: async (response) => {
          const res = await fetch('http://localhost:3001/updatePremiumStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderid: options.order_id,
              paymentid: response.razorpay_payment_id,
            }),
          });

          const resu = await res.json();
          if (resu.success === true) {
            dispatch(premiumHandler(true));
            localStorage.setItem('token', resu.token);
            setShowAlert(true); 
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Purchase Premium Error:', err);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand style={{ marginLeft: '10px' }}>Expense Tracker Pro</Navbar.Brand>
        <Nav>
          {login && (premium ? (
            <p style={{ color: 'white', margin: '10px' }}>You are a premium customer</p>
          ) : (
            <Button style={{ marginRight: '10px' }} variant="primary" onClick={purchasePremium}>
              Buy Premium
            </Button>
          ))}
          {login && (
            <Button variant="outline-danger" onClick={onLogout} style={{ marginRight: '10px' }}>
              Logout
            </Button>
          )}
        </Nav>
      </Navbar>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>Thank you for becoming a premium user!</Alert.Heading>
        <p>
          You can now enjoy the benefits of premium features.
        </p>
      </Alert>
    </>
  );
};

export default NavBar;
