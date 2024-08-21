// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ isAuthenticated, onLogin, onLogout, username, currentPath }) {
  return (
    <header className="bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg">
      <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">URL Shortener</div>
      <nav className="flex items-center space-x-2 sm:space-x-4">
        {isAuthenticated ? (
          currentPath === '/' ? (
            <div>
              <span className="mr-2 sm:mr-4">Welcome, {username}</span>
               <Link to="/dashboard"  className="dashboard-button bg-blue-600 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded mr-2" >Dashboard</Link>
               <button onClick={onLogout}  className="logout-button bg-red-600 hover:bg-red-800 text-white px-3 sm:px-4 py-2 rounded">Logout</button>
            </div>
           
          ) : ( currentPath==='/dashboard' &&
            <>
              <span className="mr-2 sm:mr-4">Welcome, {username}</span>
              <button onClick={onLogout}  className="logout-button bg-red-600 hover:bg-red-800 text-white px-3 sm:px-4 py-2 rounded">Logout</button>
            </>
          )
        ) : (
          currentPath==='/'&&
          <button onClick={onLogin} className="login-button bg-green-600 hover:bg-green-800 text-white px-3 sm:px-4 py-2 rounded">Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
