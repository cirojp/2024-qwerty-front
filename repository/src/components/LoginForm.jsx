import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        console.log("Token recibido:", token);
        localStorage.setItem("token", token);
        navigate("/index");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-6">
      <div className="bg-blue-950 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">LOGIN</h2>
        <p className="text-center text-gray-100 mb-6">Ingrese su email y contraseña</p>
        <form 
          onSubmit={(e) => { e.preventDefault(); onClick(); }} 
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-100">Email:</label>
            <input 
              type="email" 
              className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              value={email} 
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">Contraseña:</label>
            <input 
              type="password" 
              className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
              value={password} 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="flex justify-between items-center">
            <button 
              type="submit" 
              className="w-full bg-red-500 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Log In
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            {/*<button 
              type="button" 
              className="w-full bg-red-500 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>*/}
          </div>
        </form>
        <div className="mt-4 text-center text-gray-400">
        En caso de no estar registrado, <a href="#" className="text-red-500 hover:underline" onClick={() => navigate("/register")}>Sign Up</a>
        <br/>
          Olvidaste tu contraseña? <a href="#" className="text-red-500 hover:underline" onClick={() => navigate("/forgot-password")}>Recuperar Contraseña</a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
