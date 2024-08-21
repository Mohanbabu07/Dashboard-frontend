// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrl from "../config";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log token for debugging

      if (token) {
        try {
          const { data } = await axios.get(`${apiUrl}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserDetails(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Unable to fetch user profile. Please try again later.');
        }
      } else {
        setError('No token found. Please log in again.');
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome, {userDetails.name}</h1>
            {/* Display additional user details */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-300 rounded-md">
                <h2 className="text-xl font-semibold">Profile Details</h2>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Gender:</strong> {userDetails.gender}</p>
                {/* Add more details as needed */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
