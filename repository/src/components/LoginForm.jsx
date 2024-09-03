import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const onClick = () => {
    const userData = {
      username: username,
      password: password
    };
    console.log(userData);
    setUsername("");
    setPassword("");
    navigate("/index");
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-500 p-4 h-full'>
      <div className="w-full max-w-md bg-success border border-gray-700 rounded-lg p-6 shadow-lg">
        <div className="text-center text-2xl text-black font-bold mb-4">LOGIN</div>
        <div className="text-left text-black mb-3 ml-3">Ingrese su usuario y contraseña</div>
        <form className="space-y-10">
          <div>
            <label className="block text-black mb-5 ml-3 mr-3">Usuario:</label>
            <input 
              type="text" 
              className="w-50 ml-4 p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white" 
              value={username} 
              placeholder='Username' 
              onChange={changeUsername} 
            />
          </div>
          <div>
            <label className="block text-black ml-3 mb-5">Contraseña:</label>
            <input 
              type="password" 
              className="w-50 ml-3 p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 text-white" 
              value={password} 
              placeholder='Password' 
              onChange={changePassword} 
            />
          </div>
          <div className="flex space-x-4 ml-3 ">
            <button 
              type="button" 
              className="bg-primary text-white py-2 rounded hover:bg-blue-700"
              onClick={onClick}
            >
              Log In
            </button>
            <button 
              type="button" 
              className="bg-primary text-white py-2 rounded hover:bg-blue-700"
              onClick={() => { console.log("A Registrarse!"); }}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className='text-center text-gray-400 mt-4'>Recuperar Contraseña</div>
      </div>
    </div>
  );
}

export default LoginForm;
