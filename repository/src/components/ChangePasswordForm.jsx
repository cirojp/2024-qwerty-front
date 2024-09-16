import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
      };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Las nuevas contraseñas no coinciden");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/users/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                alert("Contraseña cambiada con éxito");
                navigate("/index");
            } else {
                setError("Error al cambiar la contraseña");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-6">
            <div className="bg-blue-950 shadow-md rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-center mb-0">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-950">
                        <img 
                        src="../src/assets/logo.png" 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-gray-100">Cambiar Contraseña</h1>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-100">Contraseña Actual:</label>
                        <div className="relative">
                            <input 
                                type={showCurrentPassword ? "text" : "password"}
                                className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                value={currentPassword} 
                                placeholder="Contraseña Actual" 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleCurrentPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                             >
                                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-100">Nueva Contraseña:</label>
                        <div className="relative">
                            <input 
                                type={showNewPassword ? "text" : "password"}
                                className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                value={newPassword} 
                                placeholder="Nueva Contraseña" 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                             >
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-100">Confirmar Nueva Contraseña:</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                value={confirmPassword} 
                                placeholder="Repetir Contraseña" 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-2"
                             >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-500 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                        Cambiar Contraseña
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className='flex justify-center pt-3'>
                    <a href="/index" className="text-red-500 hover:underline" onClick={() => navigate("/index")}>Volver</a>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordForm;
