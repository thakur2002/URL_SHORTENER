// src/App.js
import React, { useState, useEffect } from 'react';
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
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 
  const[logging,setLogging]=useState(false);

  useEffect(() => {
    const savedtoken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedtoken) {
      setToken(savedtoken);
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const loginHandler = () => {
      // Show login form
      setLogging(!logging);
    
  };
  
  const handleAuthSuccess = (newtoken,newname) => {
    setToken(newtoken);
    setUsername(newname);
    setIsAuthenticated(true);
    setLogging(false);
    localStorage.setItem('token', newtoken);
    localStorage.setItem('username', newname)
    
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/');
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
            isAuthenticated ? <Dashboard username={username} token={token}/> : <Navigate to="/" />
          }
        />
         <Route path="/reset-password-request" element={<PasswordResetRequest />} />
         <Route path="/reset-password/:token" element={<PasswordResetForm />} />
      </Routes>
    </div>
  );
}

export default App;
