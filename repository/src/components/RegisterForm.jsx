import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    // Contraseña mínima de 8 caracteres, al menos un número, un carácter especial,
    // una letra mayúscula, una letra minúscula y que no contenga caracteres prohibidos.
    const passwordRegex = /^(?!.*['"\\/|])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayuscula y minuscula, un número, un carácter especial y no puede contener comillas simples, dobles, barra vertical, barra inclinada o barra invertida.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        navigate("/"); // Redirige al login después del registro exitoso
      } else {
        if (response.status === 409) {
          setError("Email ya en uso. Intente iniciar sesión o utilizar otro e-mail.");
        } else {
          setError("Ocurrió un error. Intenta nuevamente.");
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">REGISTER</h2>
        <p className="text-center text-gray-600 mb-6">Crea una nueva cuenta</p>
        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-gray-500">
          <a href="/" className="text-indigo-600 hover:underline">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
