import React, { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import ModalCategoria from "./ModalCategoria";
import "./styles/ProfilePage.css";
import logo from "../assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteCategory from "./ConfirmDeleteCategory";

function ProfilePage() {
  library.add(fas);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payCategories, setPayCategories] = useState([]);
  const [editCategory, setEditCategory] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const navigate = useNavigate();
  const checkIfValidToken = async (token) => {
    try {
      const response = await fetch(
        "https://two024-qwerty-back-2.onrender.com/api/transacciones/userTest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        //entra aca si pasa la autenticacion
        return true; //si esta activo tengo que devolver true
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  };
  const fetchPersonalCategorias = async () => {
    const token = localStorage.getItem("token");
    if (await checkIfValidToken(token)) {
      try {
        const response = await fetch(
          "https://two024-qwerty-back-2.onrender.com/api/personal-categoria",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const customOptions = data.map((cat) => ({
            label: cat.nombre,
            value: cat.nombre,
            iconPath: cat.iconPath,
            textColor: "mr-2 text-white",
          }));
          setPayCategories(customOptions);
        }
      } catch (error) {
        console.error("Error al obtener las categorías personalizadas:", error);
      }
    } else {
      console.log("deberia redirec");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchPersonalCategorias();
  }, []);

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
        "https://two024-qwerty-back-2.onrender.com/api/personal-categoria/" +
          inputValue.nombre,
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
        "https://two024-qwerty-back-2.onrender.com/api/personal-categoria",
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
        "https://two024-qwerty-back-2.onrender.com/api/personal-categoria",
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
      } else {
        const errorMessage = await response.text();
        console.error("Error al agregar categoria:", errorMessage);
        console.log("la categoria existeeeeeeeeeee");
        return "La categoria ya existe";
      }
    } catch (err) {
      console.log(err);
      return "";
    }
    return "";
  };

  const confirmDelete = (categoryValue) => {
    setConfirmDeleteOpen(true);
    setItemToDelete(categoryValue);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 py-10">
      <div className="text-2xl font-bold text-gray-100 text-center mb-4">
        Mi Cuenta
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-yellow-600">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <div className="font-bold text-yellow-500 text-xl text-center mb-4">
            Mis Categorías
          </div>

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
            {payCategories.map((category) => (
              <li
                key={category.value}
                className="bg-gray-700 p-3 rounded-md shadow mb-3 flex justify-between"
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={category.iconPath}
                    className={category.textColor}
                  />
                  <div className={category.textColor}>{category.label}</div>
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
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-700"
            onClick={() => {
              setEditCategory({});
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
          >
            Agregar Categoría
          </button>
        </div>

        <div className="m-4">
          <ActionButtons />
        </div>
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
    </div>
  );
}

export default ProfilePage;
