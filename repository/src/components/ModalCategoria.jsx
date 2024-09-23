import React, { useState } from 'react';
import Modal from 'react-modal';

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
                {['icono1.png', 'icono2.png'].map((icono) => (
                    <img
                        key={icono}
                        src={require(`../assets/iconosCategorias/${icono}`)}
                        alt={icono}
                        onClick={() => setIconoSeleccionado(icono)}
                        className={`icono ${iconoSeleccionado === icono ? 'selected' : ''}`}
                    />
                ))}
            </div>
            <button onClick={handleCreateCategory} className="btn-crear-categoria">Crear Categoría</button>
            <button onClick={onRequestClose} className="btn-cerrar">Cerrar</button>
        </Modal>
    );
};

export default ModalCategoria;
