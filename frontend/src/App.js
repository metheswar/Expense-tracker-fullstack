
import './App.css';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import AuthPage from './Components/AuthComponent';
import InputForm from './Components/InputForm';
import NavBar from './Components/NavBar';
import { useEffect } from 'react';


function App() {
const authenticated = useSelector((state)=>state.authentication.authenticated);

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
  {!authenticated ? <Route path="/" element={<AuthPage />} /> : 
  <Route path="/" element={<InputForm />} />
  }
  </Routes>
</Router>
</>
  );
}

export default App;
