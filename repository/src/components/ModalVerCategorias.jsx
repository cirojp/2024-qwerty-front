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

function ModalVerCategorias({
  isModalCategoriaOpen,
  closeModalCategoria,
  payCategories,
  fetchPersonalCategorias,
  setPayCategories,
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
  ];
  const closeWindow = () => {
    setModalError("");
    closeModalCategoria();
  };
  const handleEdit = async (categoryValue, newName, newIcon) => {
    const filteredCategories = payCategories.filter(
      (category) => category.value === categoryValue.value
    );
    const token = localStorage.getItem("token");
    const inputValue = {
      nombre: filteredCategories[0].label,
      iconPath: filteredCategories[0].iconPath,
    };
    const newValue = {
      nombre: newName,
      iconPath: newIcon,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/personal-categoria/" + inputValue.nombre,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newValue),
        }
      );
      if (response.ok) {
        console.log(`Categoría editada: ${categoryValue}`);
        setPayCategories([]);
        await fetchPersonalCategorias();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (categoryValue) => {
    const filteredCategories = payCategories.filter(
      (category) => category.value === categoryValue
    );
    const token = localStorage.getItem("token");
    const inputValue = {
      nombre: filteredCategories[0].label,
      iconPath: filteredCategories[0].iconPath,
    };
    setConfirmDeleteOpen(false);
    try {
      const response = await fetch(
        "http://localhost:8080/api/personal-categoria",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inputValue),
        }
      );
      if (response.ok) {
        console.log(`Categoría eliminada: ${categoryValue}`);
        setPayCategories([]);
        await fetchPersonalCategorias();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setClickDelete(false);
    setItemToDelete({});
  };

  const handleAddCategory = async (newName, newIcon) => {
    const token = localStorage.getItem("token");
    const newValue = {
      nombre: newName,
      iconPath: newIcon,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/personal-categoria",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newValue),
        }
      );
      if (response.ok) {
        console.log(`Categoría agregada: ${newName}`);
        setPayCategories([]);
        await fetchPersonalCategorias();
        setIsModalOpen(false);
        setEditCategory({});
      } else {
        const errorMessage = await response.text();
        console.error("Error al agregar categoria:", errorMessage);
        console.log("la categoria existeeeeeeeeeee");
        return "La categoria ya existe";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (categoryValue) => {
    setConfirmDeleteOpen(true);
    setItemToDelete(categoryValue);
  };

  return (
    <Modal
      isOpen={isModalCategoriaOpen}
      onRequestClose={closeModalCategoria}
      contentLabel="Mis Categorias"
      style={customStyles}
      className="bg-gray-950 shadow-lg p-4 rounded-lg"
    >
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mis Categorias
      </div>
      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <ul>
            {defaultCategories.map((category) => (
              <li
                key={category.value}
                className="bg-gray-700 p-3 rounded-md shadow mb-3"
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={category.iconPath}
                    className={`${category.textColor} text-lg`}
                  />
                  <div className={category.textColor}>{category.label}</div>
                </div>
              </li>
            ))}
          </ul>

          <ul>
            {payCategories.slice(7).map((category) => (
              <li
                key={category.value}
                className="bg-gray-700 p-3 rounded-md shadow mb-3 flex justify-between"
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={category.iconPath} />
                  <div className="ml-2">{category.label}</div>
                </div>
                <div className="flex items-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => {
                      setEditCategory(category);
                      setIsEditMode(true);
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => confirmDelete(category.value)}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-3 bg-yellow-500 text-black rounded-md hover:bg-yellow-700 mr-2"
            onClick={() => {
              setEditCategory({});
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
          >
            Agregar Categoría
          </button>
          <button
            onClick={closeWindow}
            className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Cerrar
          </button>
        </div>{" "}
      </div>
      <ModalCategoria
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        handleCreateCat={handleAddCategory}
        handleEditCat={handleEdit}
        edit={isEditMode}
        editCat={editCategory}
      />
      <ConfirmDeleteCategory
        isOpen={confirmDeleteOpen}
        handleClose={cancelDelete}
        handleDelete={() => {
          handleDelete(itemToDelete);
        }}
      />
    </Modal>
  );
}

export default ModalVerCategorias;
