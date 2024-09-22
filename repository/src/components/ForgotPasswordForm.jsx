// ForgotPasswordForm.jsx
import React, { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/auth/forgot-password?email=" + email, {
        method: "POST"
      });
      
      if (response.ok) {
        setMessage("Email enviado con éxito. Por favor revisa tu bandeja de entrada.");
        setMessageColor("text-green-600 text-sm text-center");
      } else {
        setMessage("Error al enviar el email.");
        setMessageColor("text-red-500 text-sm text-center");
      }
    } catch (err) {
      setMessage("Ocurrió un error.");
      setMessageColor("text-red-500 text-sm text-center");
    } finally {
      setLoading(false);
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
            className="w-full bg-yellow-500 bg-opacity-80 text-gray-950 py-2 px-4 rounded-lg hover:bg-yellow-700 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                  <div className="loading-circle border-4 border-t-yellow-600 border-gray-200 rounded-full w-6 h-6 animate-spin mr-2"></div>
                  Cargando...
              </>
            ) : (
              "Enviar e-mail de recuperación"
            )}
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
