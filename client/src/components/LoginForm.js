
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const LoginForm = ({ onAuthSuccess, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  
  function capitalisewords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
  const handleSubmit = async (e) => {
    

    e.preventDefault();
    const endpoint = isLogin ? 'https://url-shortener-zmi5.onrender.com/authenticate/login' : 'https://url-shortener-zmi5.onrender.com/authenticate/signup';
    try {
      const response = await axios.post(endpoint, { username, password });
      if (response.status===201 && isLogin) {
        onAuthSuccess(response.data.token,username);
      } else if(response.status===201 && !isLogin){
        setMessage(response.data.message);
      }
    } catch (e) {
      setMessage(e.response?.data?.error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setPassword('');
    setUsername('');
  };

  return (
    <div  className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 opacity-100 pointer-events-auto">
    <div className="modal-content bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
      <div className="modal-header flex justify-between items-center mb-4">
      <h4 className="modal-title text-xl font-semibold">{isLogin ? 'Login' : 'Sign Up'}</h4>
      <button className="close-button text-black text-2xl font-bold" onClick={handleClose}>
            &times;
          </button>
      </div>
      <div className="modal-body">
      <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username:</label>
        <input className="border p-2 w-full" type="text" value={username} maxLength={20} onChange={(e) => setUsername(capitalisewords(e.target.value))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password:</label>
        <input className="border p-2 w-full" type="password" value={password} maxLength={20} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="bg-blue-500  hover:bg-blue-800 active:bg-blue-400 text-white px-4 py-2 rounded mt-2" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
    </form>
    {message && <p>{message}</p>}
    <p>
        {isLogin ? 'New user? ' : 'Already have an account? '}
        <button onClick={toggleForm} className="toggle-button">
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
      {isLogin && (
        <p>
          <Link to="/reset-password-request">Forgot Password?</Link>
        </p>
      )}
      </div>
    </div>
  </div>
    
  );
};

export default LoginForm;
