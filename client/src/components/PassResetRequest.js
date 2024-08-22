import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const PasswordResetRequest = () => {
  const [username,setUsername]=useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  function capitalisewords(str){
    return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  }

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    try {
      const response = await axios.post('https://url-shortener-zmi5.onrender.com/authenticate/reset-password-request', { email ,username});
      setMessage(response.data.message);
    } catch (e) {
      setMessage(e.response?.data?.error);
    }
  };

 
  return (
    
      <div  className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 opacity-100 pointer-events-auto" >
    <div className="modal-content bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
      <div className="modal-header flex justify-between items-center mb-4">
      <h4 className="modal-title text-xl font-semibold">Email to Reset Password</h4>
      </div>
      <div className="modal-body">
      <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username:</label>
      <input className="border p-2 w-full" type="text" value={username} onChange={(e) => setUsername(capitalisewords(e.target.value))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <input className="border p-2 w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button className="bg-blue-500  hover:bg-blue-800 active:bg-blue-400 text-white px-4 py-2 rounded mt-2" type="submit">Send Reset Link</button>
    </form>
    {message && <p>{message}</p>}
    <p>
        Remembered Password?{' '}
        <Link to="/">Login now</Link>
      </p>
      </div>
    </div>
  </div>
  
    
  );
};

export default PasswordResetRequest;
