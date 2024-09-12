import React from 'react';
import "./styles/ActionButtons.css";

function ActionButtons({ navigate, signOff, deleteAccount }) {
    return (
        <div className="mt-5 flex justify-end space-x-4"> {/* Flex para alinear y espacio entre botones */}
            <button 
                className="w-auto bg-red-500 bg-opacity-80 text-white text-sm py-1 px-4 rounded-lg hover:bg-red-700"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <button 
                className="w-auto bg-red-500 bg-opacity-80 text-white text-sm py-1 px-4 rounded-lg hover:bg-red-700"
                onClick={() => signOff()}
            >
                Cerrar Sesión
            </button>
            <button 
                className="w-auto bg-red-500 bg-opacity-80 text-white text-sm py-1 px-4 rounded-lg hover:bg-red-700"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
        </div>

    );
}

export default ActionButtons;
