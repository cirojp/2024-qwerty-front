import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-100">Nueva Contraseña:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-100">Confirmar Nueva Contraseña:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border bg-blue-950 text-white border-blue-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-500 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                        Cambiar Contraseña
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
        </div>
    );
}

export default ChangePasswordForm;
