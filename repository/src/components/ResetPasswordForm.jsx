// ResetPasswordForm.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');
  const navigate = useNavigate(); 

  useEffect(() => {
    if(token == null){
      navigate("/");
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${newPassword}`, {
        method: "POST"
      });
      if (response.ok) {
        setMessage("Password reset successfully.");
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage("Error resetting password.");
      }
    } catch (err) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password:</label>
            <input 
              type="password" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Reset Password
          </button>
          {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
