// src/components/AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiUrl from "../config";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials] = useState({ email: 'admin@email.com', password: 'Admin@123' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/api/admin/login`, credentials);
      localStorage.setItem('adminToken', data.token); // Save the token in localStorage
      navigate('/admin/dashboard'); // Redirect to the dashboard
    } catch (err) {
      alert('Admin login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              name='email' 
              type='email' 
              placeholder='Email' 
              value={credentials.email} 
              readOnly 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div>
            <input 
              name='password' 
              type='password' 
              placeholder='Password' 
              value={credentials.password} 
              readOnly 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div>
            <button 
              type='submit' 
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login as Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
