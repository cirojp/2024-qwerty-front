import React from 'react';

function ActionButtons({ navigate, signOff, deleteAccount }) {
    return (
        <div className="mt-5">
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => navigate('/change-password')}
            >
                Cambiar Contraseña
            </button>
            <br />
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg mt-3"
                onClick={() => signOff()}
            >
                Cerrar Sesion
            </button>
            <br/>
            <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg mt-3"
                onClick={() => deleteAccount()}
            >
                Eliminar Cuenta
            </button>
        </div>
    );
}

export default ActionButtons;
