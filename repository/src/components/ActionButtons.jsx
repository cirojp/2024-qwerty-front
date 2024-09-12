import React from 'react';
import "./ActionButtons.css";

function ActionButtons({ navigate, signOff, deleteAccount }) {
    return (
        <div className="mt-5">
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg change-password-btn"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg sign-off-btn"
                onClick={() => signOff()}
            >
                Cerrar Sesión
            </button>
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg delete-account-btn"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
            </div>

    );
}

export default ActionButtons;
