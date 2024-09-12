import React, { useState } from 'react';
import Modal from 'react-modal';
import CreatableSelect from 'react-select/creatable';
import './ModalForm.css';

function ModalForm({ isModalOpen, closeModal, agregarTransaccion, edit, motivo, descripcion, valor, fecha, handleMotivoChange, handleDescripcionChange, setValor, handlePayChange, selectedPayMethod, payOptions, handleCreate, setFecha }) {
    const modalStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90%',
            zIndex: 1001,
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
        },
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Agregar Transacción"
            className="modal-container"
            overlayClassName="modal-overlay"
        >
            <h2 className="modal-title">
                {edit ? "Editar Transacción" : "Agregar Nueva Transacción"}
            </h2>
            <form onSubmit={agregarTransaccion} className="modal-form">
                <div className="form-group">
                    <label className="modal-label">Motivo:</label>
                    <input
                        type="text"
                        value={motivo}
                        onChange={handleMotivoChange}
                        className="modal-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="modal-label">Descripción:</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        className="modal-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="modal-label">Valor:</label>
                    <input
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="modal-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="modal-label">Tipo de Gasto:</label>
                    <CreatableSelect
                        options={payOptions}
                        onChange={handlePayChange}
                        onCreateOption={handleCreate}
                        value={selectedPayMethod}
                        className="modal-select"
                    />
                </div>
                <div className="form-group">
                    <label className="modal-label">Fecha:</label>
                    <input
                        type="datetime-local"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="modal-input"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="modal-button modal-button-submit"
                >
                    {edit ? "Guardar Cambios" : "Agregar Transacción"}
                </button>
            </form>
            <button 
                onClick={closeModal}
                className="modal-button modal-button-close"
            >
                Cerrar
            </button>
        </Modal>
    );
}

export default ModalForm;
