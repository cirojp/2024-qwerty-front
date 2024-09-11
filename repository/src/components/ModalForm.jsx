import React, { useState } from 'react';
import Modal from 'react-modal';
import CreatableSelect from 'react-select/creatable';

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
            style={modalStyles}
        >
            <h2 className="text-2xl font-semibold mb-4">{edit ? "Editar Transacción" : "Agregar Nueva Transacción"}</h2>
            <form onSubmit={agregarTransaccion} className="space-y-4">
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Motivo:</label>
                    <input 
                        type="text" 
                        value={motivo}
                        onChange={handleMotivoChange}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Descripción:</label>
                    <input 
                        type="text" 
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Valor:</label>
                    <input 
                        type="number" 
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Tipo de Gasto:</label>
                    <CreatableSelect 
                        options={payOptions} 
                        onChange={handlePayChange}
                        onCreateOption={handleCreate}
                        value={selectedPayMethod}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Fecha:</label>
                    <input 
                        type="datetime-local" 
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    {edit ? "Guardar Cambios" : "Agregar Transacción"}
                </button>
            </form>
            <button 
                onClick={closeModal}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Cerrar
            </button>
        </Modal>
    );
}

export default ModalForm;
