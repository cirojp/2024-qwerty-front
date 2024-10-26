import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import "./styles/ModalForm.css";
import ModalCategoria from "./ModalCategoria";
import CreatableSelect from "react-select/creatable";

function ModalForm({
  isModalOpen,
  closeModal,
  agregarTransaccion,
  edit,
  motivo,
  valor,
  fecha,
  handleMotivoChange,
  setValor,
  selectedCategory,
  payCategories,
  handleCategoryChange,
  handleCreateCat,
  setFecha,
  handlePayChange,
  selectedPayMethod,
  payOptions,
  handleCreateTP,
}) {
  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: "2rem",
      borderRadius: "0.75rem",
      width: "90vw",
      maxWidth: "500px",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      zIndex: 1001,
    },
  };
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#111827",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#111827",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eab308" : "#111827",
      color: state.isSelected ? "black" : "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),
  };
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
  const openModalCategoria = () => {
    setIsModalCategoriaOpen(true);
  };
  const closeModalCategoria = () => {
    setIsModalCategoriaOpen(false);
  };
  const sendTransaccion = async (e) => {
    e.preventDefault();
    if (valor <= 0) {
      setModalError("Ingrese un valor positivo");
      return;
    }
    setIsLoading(true);
    try {
      await agregarTransaccion(e, selectedCategory.value); // Espera a que se complete la transacción
    } catch (error) {
      console.error("Error al agregar transacción:", error);
    } finally {
      setIsLoading(false); // Desactivamos el spinner al finalizar
      closeModal();
      setModalError("");
    }
  };
  const closeWindow = () => {
    setModalError("");
    closeModal();
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
      <form onSubmit={sendTransaccion} className="flex flex-col gap-3">
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
          <label className="text-center text-gray-100 mb-6">
            Medio de Pago:
          </label>
          <CreatableSelect
            options={payOptions}
            onChange={handlePayChange}
            onCreateOption={handleCreateTP}
            value={selectedPayMethod}
            className="custom-select mt-1 block w-full border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm border-transparent"
            styles={customSelectStyles}
            required
          />
        </div>
        <div>
          <label className="text-center text-gray-100 mb-6">Categoria:</label>
          <div className="flex items-center">
            <Select
              options={payCategories}
              onChange={handleCategoryChange}
              value={selectedCategory}
              className="custom-select mt-1 block w-full border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm border-transparent"
              styles={customSelectStyles}
              required
            />
            <button
              type="button"
              onClick={() => openModalCategoria()}
              className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="text-center text-gray-100 mb-6">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
        </div>
        {modalError && (
          <div className="text-red-500 text-sm text-center">{modalError}</div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-yellow-500 bg-opacity-80 font-bold text-gray-950 py-2 px-4 rounded-lg hover:bg-yellow-700"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-gray-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span className="ml-2">Cargando...</span>
              </div>
            ) : edit ? (
              "Guardar Cambios"
            ) : (
              "Agregar Transacción"
            )}
          </button>
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Cerrar
          </button>
        </div>
      </form>
      <ModalCategoria
        isOpen={isModalCategoriaOpen}
        onRequestClose={closeModalCategoria}
        handleCreateCat={handleCreateCat}
      />
    </Modal>
  );
}

export default ModalForm;
