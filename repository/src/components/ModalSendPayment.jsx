import React, { useState } from "react";
import Modal from "react-modal";

function ModalSendPayment(isModalOpen = false) {
  const [motivo, setMotivo] = useState("");
  const [valor, setValor] = useState(0);
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
  const handleMotivoChange = (e) => {
    setMotivo(e.target.value);
  };
  const handleValorChange = (e) => {
    setValor(e.target.value);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => {}}
      style={customStyles}
      contentLabel="Agregar Transacción"
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-1 text-gray-100">
        Generar nuevo pago
      </h2>
      <form className="flex flex-col gap-3">
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
            onChange={handleValorChange}
            className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
        </div>
        <div>
          <label className="text-center text-gray-100 mb-6">Categoria:</label>
          <div className="flex items-center">
            <button
              type="button"
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
            className="mt-1 block w-full p-2 border bg-gray-900 text-white border-yellow-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            required
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 bg-yellow-500 bg-opacity-80 font-bold text-gray-950 py-2 px-4 rounded-lg hover:bg-yellow-700"
          >
            Realizar Pago
          </button>
          <button className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300">
            Cerrar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalSendPayment;
