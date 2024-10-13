import React, { useState } from "react";
import Modal from "react-modal";

function AlertPending({
  pendingTransaction,
  isOpen,
  isAccepted = () => {},
  isRejected = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = () => {
    setIsLoading(true);
    isAccepted(pendingTransaction);
    setIsLoading(false);
  };

  const handleReject = () => {
    isRejected(pendingTransaction);
  };

  return (
    <Modal
      isOpen={isOpen}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
      overlayClassName="flex items-center justify-center"
    >
      <div className="relative w-11/12 max-w-lg bg-gray-900 text-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">CONFIRMAR TRANSACCION</h2>
        <label className="block mb-2">Confirme o rechace la transaccion</label>
        <label className="block mb-2">
          Motivo: {pendingTransaction.motivo}
        </label>
        <label className="block mb-2">Valor: {pendingTransaction.valor}</label>
        <label className="block mb-2">Fecha: {pendingTransaction.fecha}</label>
        {pendingTransaction.sentByEmail != "" && (
          <label className="block mb-4">
            Enviado por: {pendingTransaction.sentByEmail}
          </label>
        )}
        <div className="flex justify-end">
          <button
            className="bg-yellow-500 hover:bg-yellow-800 text-black font-bold py-2 px-4 rounded mr-2"
            onClick={handleAccept}
            disabled={isLoading}
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
            ) : (
              "Aceptar"
            )}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReject}
          >
            Rechazar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AlertPending;
