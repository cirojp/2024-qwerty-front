import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const ModalMedioDePago = ({
  isOpen = false,
  onRequestClose = () => {},
  handleCreateTP = () => {},
  handleEditTP = () => {},
  edit = false,
  editTP = {},
}) => {
  library.add(fas);
  // Estilos del Modal
  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.9)", // Fondo semitransparente
      zIndex: 1002,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative",
      width: "90%", // El modal ocupa el 90% del ancho en dispositivos pequeños
      maxWidth: "500px", // Máximo ancho del modal para pantallas grandes
      height: "auto", // Altura automática para ajustarse al contenido
      maxHeight: "90vh", // En pantallas pequeñas, que no exceda el 90% de la altura de la ventana
      padding: "20px", // Padding interno adaptativo
      margin: "auto", // Centrar el modal
      borderRadius: "10px", // Bordes redondeados
      backgroundColor: "#1a1a1a", // Fondo oscuro para mantener el estilo
      overflowY: "auto", // Habilitamos scroll si el contenido es demasiado grande
    },
  };

  const [medioDePagoNombre, setMedioDePagoNombre] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (edit) {
      setMedioDePagoNombre(editTP.value);
    } else {
      setMedioDePagoNombre("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    if (!medioDePagoNombre) {
      setError("Debes ingresar un nombre.");
      setIsLoading(false);
      return;
    }
    try { 
      if (!edit) {
        await handleCreateTP(medioDePagoNombre);
      } else {
        await handleEditTP(editTP, medioDePagoNombre);
      }
      handleClose();
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      const mensajeError = err?.message || "Ocurrió un error al crear Medio de Pago.";
      setError(mensajeError);
  }
  setIsLoading(false);
  };

  const handleClose = () => {
    setError("");
    setMedioDePagoNombre("");
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={edit ? "Editar Medio De Pago" : "Crear Medio de Pago"}
      style={customStyles}
      className="bg-gray-900 text-white p-4 sm:p-2 rounded-lg shadow-lg"
    >
      <h2 className="text-xl sm:text-lg font-bold mb-4">
        {edit ? "Editar Medio De Pago" : "Crear Medio de Pago"}
      </h2>
      <input
        type="text"
        placeholder="Medio de Pago"
        value={medioDePagoNombre}
        onChange={(e) => setMedioDePagoNombre(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit}
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
          "Editar Medio De Pago"
        ) : (
          "Crear Medio de Pago"
        )}
      </button>
      <button
        onClick={() => handleClose()}
        className="mt-2 w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default ModalMedioDePago;
