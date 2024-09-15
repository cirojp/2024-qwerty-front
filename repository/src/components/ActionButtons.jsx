import React from 'react';
import "./styles/ActionButtons.css";

function ActionButtons({ navigate, signOff, deleteAccount }) {
    return (
        <div className="mt-5 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
            {/* Cambiar a flex-col en pantallas pequeñas y mantener el espacio entre los botones */}
            <button 
                className="w-full md:w-auto bg-red-500 bg-opacity-80 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <button 
                className="w-full md:w-auto bg-red-500 bg-opacity-80 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => signOff()}
            >
                Cerrar Sesión
            </button>
            <button 
                className="w-full md:w-auto bg-red-500 bg-opacity-80 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
        </div>
    );
}

export default ActionButtons;
