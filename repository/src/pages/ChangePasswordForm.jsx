import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );
      /*const response = await fetch("https://two024-qwerty-back-2.onrender.com/api/users/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });*/

      if (response.ok) {
        alert("Contraseña cambiada con éxito");
        navigate("/index");
      } else {
        setError("Error al cambiar la contraseña");
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-gray-950 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">
          Cambiar Contraseña
        </h1>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Contraseña Actual:
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                value={currentPassword}
                placeholder="Contraseña Actual"
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 hover:bg-yellow-700"
              >
                <FontAwesomeIcon
                  color="#F8C104"
                  icon={showCurrentPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Nueva Contraseña:
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                value={newPassword}
                placeholder="Nueva Contraseña"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 hover:bg-yellow-700"
              >
                <FontAwesomeIcon
                  color="#F8C104"
                  icon={showNewPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Confirmar Nueva Contraseña:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                value={confirmPassword}
                placeholder="Repetir Contraseña"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 hover:bg-yellow-700"
              >
                <FontAwesomeIcon
                  color="#F8C104"
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
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
              "Cambiar Contraseña"
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex justify-center pt-3">
          <a
            href="/"
            className="text-yellow-500 hover:underline"
            onClick={() => navigate("/")}
          >
            Volver
          </a>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
