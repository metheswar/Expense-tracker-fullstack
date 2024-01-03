import React, { useState} from 'react';
import { Button, Alert, Navbar, Nav, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { logoutHandler, premiumHandler } from '../store/authSlice';
import { clear } from '../store/expenseSlice';
import { Link, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

const NavBar = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.authentication.authenticated);
  const premium = useSelector((state) => state.authentication.premium);
  const expenses = useSelector((state)=>state.expenses.expenses)

  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const onLogout = () => {
    dispatch(clear());
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch(logoutHandler());
    navigate('/')
  };

  const downloadHandler = async () =>{
    try {


      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/downloadExpenses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const { fileUrl } = result;

       
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'expenses.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
      
        const result = await response.json();
        console.error('Download Expenses Error:', result.error);

      }
    } catch (err) {
      console.error('Download Expenses Error:', err);
    
    }
  }
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
      <Navbar bg="dark" variant="dark" expand="md" style={{padding:'10px'}}>
        <Navbar.Brand as={Link} to="/">
          Expense Tracker Pro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse className="justify-content-end">
          {login && (
            <Nav>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {premium && <Nav.Link as={Link} to="/leaderboard">
                LeaderBoard
              </Nav.Link>}
              {premium &&<Nav.Link as={Link} to="/analyze">Expense Analyze</Nav.Link> }
              {premium ? <Nav.Link  style={{color:'white',marginRight:'10px'}} >
              👑Premium Customer
              </Nav.Link>  : (
                <Button variant="light" onClick={purchasePremium} style={{marginRight:'10px'}} className="mr-3">
                  👑Buy Premium
                </Button>
              )}
              {premium && <Button variant="primary" onClick={downloadHandler} style={{marginRight:'10px'}}>Download CSV</Button>}
              <Button variant="outline-danger" onClick={onLogout}>
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Row>
        <Col>
          <Alert
            show={showAlert}
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>Thank you for becoming a premium user!</Alert.Heading>
            <p>You can now enjoy the benefits of premium features.</p>
          </Alert>
        </Col>
      </Row>
    </>
  );
};

export default NavBar;
