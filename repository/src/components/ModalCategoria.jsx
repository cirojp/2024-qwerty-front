import React, { useState } from 'react';
import Modal from 'react-modal';

import icono1 from '../assets/iconosCategorias/icono1.png';
import icono2 from '../assets/iconosCategorias/icono2.png';

const ModalCategoria = ({ isOpen, onRequestClose, onCreateCategory }) => {
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
            padding: '2rem',
            borderRadius: '0.75rem',
            width: '90vw',
            maxWidth: '500px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            zIndex: 1003,
        },
    };
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
            style={customStyles}
        >
            <h2 className="text-2xl font-bold">Crear Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={categoriaNombre}
                onChange={(e) => setCategoriaNombre(e.target.value)}
                className="input-categoria"
            />
            <label className="mt-4">Selecciona un icono:</label>
            <div className="iconos-container">
                {iconos.map((icono) => (
                    <div
                        key={icono.alt}
                        className={`icono-item ${iconoSeleccionado === icono.value ? 'selected' : ''}`}
                        onClick={() => setIconoSeleccionado(icono.value)}
                    >
                        <img src={icono.src} alt={icono.alt} className="icono-img" />
                    </div>
                ))}
            </div>
            <button onClick={handleCreateCategory} className="btn-crear-categoria">Crear Categoría</button>
            <button onClick={onRequestClose} className="btn-cerrar">Cerrar</button>
        </Modal>
    );
};

export default ModalCategoria;