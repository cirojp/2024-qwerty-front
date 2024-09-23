import React, { useState } from 'react';
import Modal from 'react-modal';

import icono1 from '../assets/iconosCategorias/icono1.png';
import icono2 from '../assets/iconosCategorias/icono2.png';

const ModalCategoria = ({ isOpen, onRequestClose, onCreateCategory }) => {
    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [iconoSeleccionado, setIconoSeleccionado] = useState('');

    const handleCreateCategory = () => {
        if (categoriaNombre && iconoSeleccionado) {
            onCreateCategory(categoriaNombre, iconoSeleccionado);
            setCategoriaNombre('');
            setIconoSeleccionado('');
            onRequestClose();
        }
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
            className="modal-categoria"
        >
            <h2 className="text-2xl font-bold">Crear Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={categoriaNombre}
                onChange={(e) => setCategoriaNombre(e.target.value)}
                className="input-categoria"
            />
            <div className="selector-iconos">
                {iconos.map((icono, index) => (
                    <img
                        key={index}
                        src={icono.src}
                        alt={icono.alt}
                        onClick={() => setIconoSeleccionado(icono.src)}
                        className={`icono ${iconoSeleccionado === icono.src ? 'selected' : ''}`}
                    />
                ))}
            </div>
            <button onClick={handleCreateCategory} className="btn-crear-categoria">Crear Categoría</button>
            <button onClick={onRequestClose} className="btn-cerrar">Cerrar</button>
        </Modal>
    );
};

export default ModalCategoria;
