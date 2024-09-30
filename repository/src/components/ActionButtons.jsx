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
            /*const response = await fetch(`http://localhost:8080/api/auth`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });*/
    
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
        <div className="mt-5 flex flex-col justify-end space-y-4 right-12">
        <button 
            className="w-full bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 rounded-lg hover:bg-yellow-700"
            onClick={() => navigate("/index")}
        >
            Ver Mis Transacciones
        </button>
        <button 
            className="w-full bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 rounded-lg hover:bg-yellow-700"
            onClick={() => navigate('/change-password')}
        >
            Cambiar Contraseña
        </button>
        <button 
            className="w-full bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 rounded-lg hover:bg-yellow-700"
            onClick={() => signOff()}
        >
            Cerrar Sesión
        </button>
        <button 
            className="w-full bg-red-600 bg-opacity-80 text-white text-sm py-2 rounded-lg hover:bg-red-900"
            onClick={() => deleteAccount()}
        >
            Eliminar Cuenta
        </button>
    </div>
    

    );
}

export default ActionButtons;
