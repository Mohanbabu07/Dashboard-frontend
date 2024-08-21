import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import apiUrl from "../config";

Chart.register(...registerables); // Register chart.js components

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/admin/users`);
        setUserData(data);

        if (Array.isArray(data) && data.length > 0) {
          const userCounts = data.map(user => user.count);
          const userEmails = data.map(user => user.email);

          setChartData({
            labels: userEmails,
            datasets: [
              {
                label: 'User Count',
                data: userCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();

    // WebSocket connection
    const socket = new WebSocket('wss://dashboard-backend-ma6s.onrender.com/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle real-time updates here, e.g., update the chartData or userData based on the message
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close(); // Clean up the WebSocket connection when the component unmounts
    };
  }, []);

  if (!chartData) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>; // Render a loading state while chartData is null
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="mb-8">
        <Bar data={chartData} />
      </div>
      <h2 className="text-2xl font-semibold mb-4">User Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2 border-b">S.No</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Count</th>
              <th className="px-4 py-2 border-b">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.count}</td>
                  <td className="px-4 py-2 border-b">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">No user data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
