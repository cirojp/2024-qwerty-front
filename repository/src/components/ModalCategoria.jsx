import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'


const ModalCategoria = ({ isOpen, onRequestClose, handleCreateCat }) => {
    library.add(fas);
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
        { alt: 'faUser', faIcon: "fa-solid fa-user"},
        { alt: 'faImage', faIcon: "fa-solid fa-image"},
        { alt: 'faStar', faIcon: "fa-solid fa-star"},
        { alt: 'faMusic', faIcon: "fa-solid fa-music"},
        { alt: 'faHeart', faIcon: "fa-solid fa-heart"},
        { alt: 'faCameraRetro', faIcon: "fa-solid fa-camera-retro"},
        { alt: 'faCar', faIcon: "fa-solid fa-car"},
        { alt: 'faMugHot', faIcon: "fa-solid fa-mug-hot"},
        { alt: 'faBook', faIcon: "fa-solid fa-book"},
        
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
                        className={`p-2 border rounded-md cursor-pointer transition duration-200 ease-in-out ${iconoSeleccionado === icono.faIcon ? 'border-yellow-500' : 'border-transparent'} hover:border-yellow-500`}
                        onClick={() => setIconoSeleccionado(icono.faIcon)}
                    >
                        <FontAwesomeIcon icon={icono.faIcon} className='fa-3x'/>
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
