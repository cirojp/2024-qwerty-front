import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    // Contraseña mínima de 8 caracteres, al menos un número, un carácter especial,
    // una letra mayúscula, una letra minúscula y que no contenga caracteres prohibidos.
    const passwordRegex =
      /^(?!.*['"\\/|])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayuscula y minuscula, un número y un carácter especial (@$!%*?&)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://two024-qwerty-back-1.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        if (response.status === 409) {
          setError(
            "Email ya en uso. Intente iniciar sesión o utilizar otro e-mail."
          );
        } else {
          setError("Ocurrió un error. Intenta nuevamente.");
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-gray-950 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
          BIENVENIDO
        </h2>
        <p className="text-center text-gray-100 mb-6">Crea una nueva cuenta</p>
        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Email:
            </label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Contraseña:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                value={password}
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 bg-yellow-600 hover:bg-yellow-700"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="text-gray-400 text-sm text-center">
            La contraseña debe tener:
          </div>
          <ul className="text-gray-400 text-sm text-left">
            <li>Al menos 8 caracteres</li>
            <li>Una mayuscula y minuscula</li>
            <li>Un número</li>
            <li>Un carácter especial</li>
            <li>
              No puede contener comillas simples, dobles, barra vertical, barra
              inclinada o barra invertida.
            </li>
          </ul>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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
              "Crear Cuenta"
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <a href="/" className="text-yellow-500 hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
