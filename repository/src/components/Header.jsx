import React, { useState } from "react";
import logo from "../assets/logo-removebg-preview.png";
import ModalVerCategorias from "./ModalVerCategorias";
import { useNavigate } from "react-router-dom";
function Header({ payCategories, setPayCategories }) {
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
  const [payCategoriesDefault, setPayCategoriesDefault] = useState([
    {
      value: "Impuestos y Servicios",
      label: "Impuestos y Servicios",
      iconPath: "fa-solid fa-file-invoice-dollar",
    },
    {
      value: "Entretenimiento y Ocio",
      label: "Entretenimiento y Ocio",
      iconPath: "fa-solid fa-ticket",
    },
    {
      value: "Hogar y Mercado",
      label: "Hogar y Mercado",
      iconPath: "fa-solid fa-house",
    },
    { value: "Antojos", label: "Antojos", iconPath: "fa-solid fa-candy-cane" },
    {
      value: "Electrodomesticos",
      label: "Electrodomesticos",
      iconPath: "fa-solid fa-blender",
    },
    { value: "Clase", label: "Clase", iconPath: "fa-solid fa-chalkboard-user" },
  ]);

  //const [payCategories, setPayCategories] = useState([]);
  const navigate = useNavigate();
  const openModalCategoria = () => {
    setIsModalCategoriaOpen(true);
  };
  const closeModalCategoria = () => {
    setIsModalCategoriaOpen(false);
  };
  const fetchPersonalCategorias = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/api/personal-categoria",
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
        }));

        setPayCategories([...payCategoriesDefault, ...customOptions]);
      }
    } catch (error) {
      console.error("Error al obtener las categorías personalizadas:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-0 w-full">
      <div className="flex items-center px-8">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-yellow-600">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div></div>
      <div className="flex justify-end items-center px-4 md:px-20 join">
        <button
          className="btn join-item w-auto mr-2 bg-yellow-500 bg-opacity-80 text-gray-950 text-sm   rounded-lg hover:bg-yellow-700"
          onClick={() => navigate("/profile")}
        >
          Mi Cuenta
        </button>
        <button
          className="btn join-item w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm  rounded-lg hover:bg-yellow-700"
          onClick={openModalCategoria}
        >
          Categorias
        </button>
      </div>
      <ModalVerCategorias
        isModalCategoriaOpen={isModalCategoriaOpen}
        closeModalCategoria={closeModalCategoria}
        fetchPersonalCategorias={fetchPersonalCategorias}
        setPayCategories={setPayCategories}
        //edit={edit}
        payCategories={payCategories}
        //handleCreateCat={handleCreateCat}
      />
    </div>
  );
}

export default Header;
