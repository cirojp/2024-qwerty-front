import React from 'react';
import "./styles/ActionButtons.css";
import { useNavigate } from 'react-router-dom';


function ActionButtons() {
    const navigate = useNavigate();
    const signOff = () => {
        localStorage.removeItem("token");
        navigate('/');
    };
    const deleteAccount = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://two024-qwerty-back-2.onrender.com/api/auth`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                localStorage.removeItem("token");
                navigate("/");
            } else {
                setError("Error al eliminar la cuenta");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        }
    };

    
    return (
        <div className="mt-5 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
            {/* Cambiar a flex-col en pantallas pequeñas y mantener el espacio entre los botones */}
            <button 
                className="w-full md:w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
                onClick={() => navigate("/index")}
            >
                Ver Mis Transacciones
            </button>
            <button 
                className="w-full md:w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <button 
                className="w-full md:w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
                onClick={() => signOff()}
            >
                Cerrar Sesión
            </button>
            <button 
                className="w-full md:w-auto bg-red-600 bg-opacity-80 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-900"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
        </div>
    );
}

export default ActionButtons;
