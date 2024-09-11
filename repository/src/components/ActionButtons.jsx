import React from 'react';

function ActionButtons({ navigate, signOff, deleteAccount }) {
    return (
        <div className="mt-6">
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg ml-5"
                onClick={() => signOff()}
            >
                Cerrar Sesion
            </button>
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg ml-5"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
        </div>
    );
}

export default ActionButtons;
