import React, { useState } from 'react';
import Modal from 'react-modal';
import CreatableSelect from 'react-select/creatable';
import './styles/ModalForm.css';

function ModalForm({ isModalOpen, closeModal, agregarTransaccion, edit, motivo, descripcion, valor, fecha, handleMotivoChange, handleDescripcionChange, setValor, handlePayChange, selectedPayMethod, payOptions, handleCreate, setFecha, error}) {
    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
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
            zIndex: 1001,
        },
    };
    const customSelectStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: "#111827",
          color: 'white',
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: '#111827',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#eab308' : '#111827',
          color: state.isSelected ? 'black': 'white',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'white',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'white',
        }),
        input: (provided) => ({
          ...provided,
          color: 'white',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          backgroundColor: 'transparent',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: 'white',
        }),
      };
      

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Agregar Transacción"
            style={customStyles}
            className="bg-gray-950 shadow-lg p-4 rounded-lg"
        >
            <h2 className="text-2xl font-bold text-center mb-1 text-gray-100">
                {edit ? "Editar Transacción" : "Agregar Nueva Transacción"}
            </h2>
            <form onSubmit={agregarTransaccion} className="flex flex-col gap-3">
                <div>
                    <label className="text-center text-gray-100 mb-6">Motivo:</label>
                    <input
                        type="text"
                        value={motivo}
                        onChange={handleMotivoChange}
                        className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>
                <div>
                    <label className="text-center text-gray-100 mb-6">Descripción:</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>
                <div>
                    <label className="text-center text-gray-100 mb-6">Valor:</label>
                    <input
                        type="number"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>
                <div>
                    <label className="text-center text-gray-100 mb-6">Tipo de Gasto:</label>
                    <CreatableSelect
                        options={payOptions}
                        onChange={handlePayChange}
                        onCreateOption={handleCreate}
                        value={selectedPayMethod}
                        className="custom-select mt-1 block w-full border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm"
                        styles={customSelectStyles}
                    />
                </div>
                <div>
                    <label className="text-center text-gray-100 mb-6">Fecha:</label>
                    <input
                        type="datetime-local"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div className="flex gap-2 mt-2">
                    <button 
                        type="submit" 
                        className="flex-1 bg-yellow-500 bg-opacity-80 font-bold text-gray-950 py-2 px-4 rounded-lg hover:bg-yellow-700"
                    >
                        {edit ? "Guardar Cambios" : "Agregar Transacción"}
                    </button>
                    <button 
                        onClick={closeModal}
                        className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                    >
                        Cerrar
                    </button>
                </div>
            </form>
            
        </Modal>
    );
}

export default ModalForm;
