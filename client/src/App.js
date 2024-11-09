// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PasswordResetRequest from './components/PassResetRequest';
import PasswordResetForm from './components/PassResetForm';
import './App.css';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 
  const[logging,setLogging]=useState(false);

  useEffect(() => {
    // const savedtoken = localStorage.getItem('token');
    // const savedUsername = localStorage.getItem('username');
    // if (savedtoken) {
    //   setToken(savedtoken);
    //   setIsAuthenticated(true);
    //   setUsername(savedUsername);
    // }
    axios.get('https://url-shortener-zmi5.onrender.com/verifytoken', { withCredentials: true })
    .then(response => {
      if (response.data.authenticated) {
        setUsername(response.data.username);
        setIsAuthenticated(true);
      }
    })
    .catch(() => setIsAuthenticated(false));
  }, []);

  const loginHandler = () => {
      // Show login form
      setLogging(!logging);
    
  };
  
  const handleAuthSuccess = (newname) => {
    
    setUsername(newname);
    setIsAuthenticated(true);
    setLogging(false);
  };

  const logoutHandler = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('username');
    // setIsAuthenticated(false);
    // navigate('/');
    axios.post('https://url-shortener-zmi5.onrender.com/logout', { withCredentials: true }) // Invalidate token by clearing the cookie
    .then(() => {
      setIsAuthenticated(false);
      navigate('/');
    });
  };

  return (
    <div className='overflow-hidden h-screen  bg-gray-800'>
      <Header
        onLogin={loginHandler}
        isAuthenticated={isAuthenticated}
        onLogout={logoutHandler}
        username={username}
        currentPath={location.pathname}
      />
      {logging && <LoginForm onAuthSuccess={handleAuthSuccess} handleClose={loginHandler}/>}
      <Routes>
        <Route path="/" element={
          <Home />
          } />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard username={username}/> : <Navigate to="/" />
          }
        />
         <Route path="/reset-password-request" element={<PasswordResetRequest />} />
         <Route path="/reset-password/:token" element={<PasswordResetForm />} />
      </Routes>
    </div>
  );
}

export default App;
