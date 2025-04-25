import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import Modal from "react-modal";

function ConfirmDeleteMedioDePago({
  isOpen = false,
  handleClose = () => {},
  handleDelete = () => {},
  pagoOmoneda
}) {
  library.add(fas);
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
  return (
    <Modal isOpen={isOpen} style={customStyles}>
      <div className="text-center mx-auto my-4">
        <FontAwesomeIcon
          icon="fa-solid fa-trash"
          style={{ color: "#E01114" }}
          size="4x"
        />
        <h3 className="text-lg font-black text-white">
          {pagoOmoneda === "pago"
            ? "Confirmar Borrado de Medio De Pago"
            : "Confirmar Borrado de Moneda"}
        </h3>
        <p className="text-sm text-gray-200">
          {pagoOmoneda === "pago"
            ? `Se eliminara este medio de pago de sus medios de pago y de todas las
              transacciones que lo esten utilizando actualmente. Las transacciones
              que utilizaban este medio de pago pasaran al medio de pago "Otros"`
            : `Se eliminara esta moneda de sus monedas cargadas y de todas las 
              transacciones que la esten utilizando actualmente. Las transacciones 
              que utilizaban esta moneda pasaran todo a ARG.`}
        </p>
        <button
          onClick={() => handleDelete()}
          className="mt-2 w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Eliminar
        </button>
        <button
          onClick={() => handleClose()}
          className="mt-2 w-full sm:w-auto bg-yellow-500 ml-2 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteMedioDePago;
