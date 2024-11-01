import Modal from "react-modal";
import Select from "react-select";
import "./styles/ModalForm.css";
import ModalCategoria from "./ModalCategoria";
import React, { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ConfirmDeleteCategory from "./ConfirmDeleteCategory";

function ModalVerDetallesGrupo({
  isModalDetallesGrupoOpen,
  closeModalDetallesGrupo,
  nombreGrupo,
  idGrupo
}) {
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
  const fetchTransaccionesDelGrupo = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token"); 
    let url = `https://two024-qwerty-back-2.onrender.com/api/grupos/${idGrupo}/transacciones`;
    try {
    const response = await fetch(url, {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        setIsLoading(false);
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    setTransacciones(data);
    setIsLoading(false);
    } catch (err) {
    setIsLoading(false);
    console.error("Error fetching transactions:", err);
    } 
    //fetchPersonalCategorias();
  };
  useEffect(() => {
    fetchTransaccionesDelGrupo();
  }, [nombreGrupo]);
  useEffect(() => {
    if (isModalDetallesGrupoOpen) {
      fetchTransaccionesDelGrupo();
    }
  }, [isModalDetallesGrupoOpen]);
  const [modalError, setModalError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const defaultCategories = [
    {
      value: "Impuestos y Servicios",
      label: "Impuestos y Servicios",
      iconPath: "fa-solid fa-file-invoice-dollar",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Entretenimiento y Ocio",
      label: "Entretenimiento y Ocio",
      iconPath: "fa-solid fa-ticket",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Hogar y Mercado",
      label: "Hogar y Mercado",
      iconPath: "fa-solid fa-house",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Antojos",
      label: "Antojos",
      iconPath: "fa-solid fa-candy-cane",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Electrodomesticos",
      label: "Electrodomesticos",
      iconPath: "fa-solid fa-blender",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Clase",
      label: "Clase",
      iconPath: "fa-solid fa-chalkboard-user",
      textColor: "mr-2 text-yellow-500",
    },
    {
      value: "Ingreso de Dinero",
      label: "Ingreso de Dinero",
      iconPath: "fa-solid fa-money-bill",
      textColor: "mr-2 text-yellow-500",
    },
  ];
  const closeWindow = () => {
    closeModalDetallesGrupo();
  };




  return (
    <Modal
      isOpen={isModalDetallesGrupoOpen}
      onRequestClose={closeModalDetallesGrupo}
      contentLabel="Detalle"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        {nombreGrupo}
      </div>
      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Transacciones</h3>
          {isLoading ? (
            <p>Cargando transacciones...</p>
          ) : transacciones.length > 0 ? (
            <ul>
              {transacciones.map((transaccion) => (
                <li key={transaccion.id} className="py-1">
                  {transaccion.motivo} - ${transaccion.valor}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay transacciones disponibles.</p>
          )}
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300 mt-4"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalVerDetallesGrupo;
