// ForgotPasswordForm.jsx
import React, { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Esperando respuesta...");
    setMessageColor("text-yellow-500 text-sm text-center");
    try {
      const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/auth/forgot-password?email=" + email, {
        method: "POST"
      });
      if (response.ok) {
        setMessage("Email sent successfully. Please check your inbox.");
        setMessageColor("text-green-600 text-sm text-center");
      } else {
        setMessage("Error sending email.");
        setMessageColor("text-red-500 text-sm text-center");
      }
    } catch (err) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-gray-950 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">Email:</label>
            <input 
              type="email" 
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-yellow-500 bg-opacity-80 text-gray-950 py-2 px-4 rounded-lg hover:bg-yellow-700"
          >
            Enviar e-mail de recuperacion
          </button>
          {message && <p className={messageColor}>{message}</p>}
        </form>
        <div className="mt-4 text-center text-gray-400">
        Volver a <a href="/" className="text-yellow-500 hover:underline"> Inicio sesión</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
