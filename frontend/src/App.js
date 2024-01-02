import './App.css';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthComponent';
import InputForm from './Components/InputForm';
import NavBar from './Components/NavBar';
import { useEffect } from 'react';
import Leaderboard from './Components/Leaderboard';
import ExpensePieChart from './Components/ExpensePieChart';
import ForgotPassword from './Components/ForgotPassword';


function App() {
  const authenticated = useSelector((state) => state.authentication.authenticated);
  const premium = useSelector((state) => state.authentication.premium);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          {!authenticated ? (
            <Route path="/" element={<AuthPage />} />
          ) : (
            <>
              <Route path="/" element={<InputForm />} />
              {premium && <Route path='/leaderboard' element={<Leaderboard />} />}
              <Route path='/analyze' element={<ExpensePieChart />} />
              <Route path="/*" element={<InputForm />} />
            </>
          )}
          <Route path="/forgotpassword" element={<ForgotPassword />}/>
          <Route path="/*" element={<AuthPage />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
