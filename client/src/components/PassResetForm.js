import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
const PasswordResetForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success,setSuccess]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`https://url-shortener-zmi5.onrender.com/authenticate/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setSuccess(true);
    } catch (e) {
        setMessage(e.response?.data?.error);
      }
  };

  return (
    
     <div  className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 opacity-100 pointer-events-auto" >
        <div className="modal-content bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3" >
      <div className="modal-header flex justify-between items-center mb-4">
      <h4 className="modal-title text-xl font-semibold">Reset Password</h4>
      </div>
      <div className="modal-body">
      <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">New Password:</label>
        <input className="border p-2 w-full"  type="password" value={password}  onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input className="border p-2 w-full"  type="password" value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <button className="bg-blue-500  hover:bg-blue-800 active:bg-blue-400 text-white px-4 py-2 rounded mt-2" type="submit">Reset Password</button>
    </form>
    {message && <p>{message}</p>}
      {success &&  <p>
          <Link to="/">Login now</Link>
        </p>}
      </div>
    </div>
  </div>

  );
};

export default PasswordResetForm;
