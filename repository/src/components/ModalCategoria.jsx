import React, { useState } from 'react';
import Modal from 'react-modal';

import icono1 from '../assets/iconosCategorias/icono1.png';
import icono2 from '../assets/iconosCategorias/icono2.png';

const ModalCategoria = ({ isOpen, onRequestClose, handleCreateCat }) => {
    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 255, 255, 0.75)',
            zIndex: 1002,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            zIndex: 1003,
        },
    };

    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [iconoSeleccionado, setIconoSeleccionado] = useState('');
    const [error, setError] = useState('');

    /*const handleCreateCategory = () => {
        if (categoriaNombre && iconoSeleccionado) {
            onCreateCategory({ label: categoriaNombre, value: categoriaNombre, icon: iconoSeleccionado });
            setCategoriaNombre('');
            setIconoSeleccionado('');
            onRequestClose();
        }
    };*/

    const handleSubmit = () => {
        if (!categoriaNombre || !iconoSeleccionado) {
            setError("Debes ingresar un nombre y seleccionar un icono.");
            return;
        }
        handleCreateCat(categoriaNombre, iconoSeleccionado);
        setCategoriaNombre('');
        setIconoSeleccionado('');
        setError('');
        onRequestClose();
    };

    const iconos = [
        { src: icono1, alt: 'Icono 1' },
        { src: icono2, alt: 'Icono 2' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Crear Categoría"
            className="bg-gray-900 text-white p-5 rounded-lg shadow-lg"
            style={customStyles}
        >
            <h2 className="text-2xl font-bold mb-4">Crear Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={categoriaNombre}
                onChange={(e) => setCategoriaNombre(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
            {error && <p className="text-red-500">{error}</p>}
            <label className="mt-4 block">Selecciona un icono:</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
                {iconos.map((icono) => (
                    <div
                        key={icono.alt}
                        className={`p-2 border rounded-md cursor-pointer transition duration-200 ease-in-out ${iconoSeleccionado === icono.src ? 'border-yellow-500' : 'border-transparent'} hover:border-yellow-500`}
                        onClick={() => setIconoSeleccionado(icono.src)}
                    >
                        <img src={icono.src} alt={icono.alt} className="w-16 h-16" />
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
                Crear Categoría
            </button>
            <button
                onClick={onRequestClose}
                className="mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
                Cerrar
            </button>
        </Modal>
    );
};

export default ModalCategoria;
