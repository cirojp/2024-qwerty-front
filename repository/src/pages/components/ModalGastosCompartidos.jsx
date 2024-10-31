import Modal from "react-modal";
import Select from "react-select";
import "./styles/ModalForm.css";
import ModalCrearGrupo from "./ModalCrearGrupo";
import React, { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ConfirmDeleteCategory from "./ConfirmDeleteCategory";

function ModalGastosCompartidos({
  isModalGastosOpen,
  closeModalGastos,
}) {
  /*useEffect(() => {
    
  }, );*/
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
      maxHeight: "80vh", // Limita la altura del modal
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      overflowY: "auto", // Habilita scroll si el contenido excede el tamaño
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const closeWindow = () => {
    setModalError("");
    closeModalGastos();
  };

  return (
    <Modal
      isOpen={isModalGastosOpen}
      onRequestClose={closeModalGastos}
      contentLabel="Mis Gastos Compartidos"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mis Gastos Compartidos
      </div>
      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          
          <button
            className="mt-4 px-4 py-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-700 mr-2"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Crear Grupo
          </button>
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Cerrar
          </button>
        </div>{" "}
      </div>

      <ModalCrearGrupo
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        //handleCreateGroup={handleCreateGroup}
      />
    </Modal>
  );
}

export default ModalGastosCompartidos;
