import React, { useState } from "react";
import logo from "../assets/logo-removebg-preview.png";
import ModalVerCategorias from "./ModalVerCategorias";
import { useNavigate } from "react-router-dom";

function Header({
  payCategories,
  setPayCategories,
  fetchPersonalCategorias,
  getTransacciones,
}) {
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

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full py-4 md:py-6 px-4 md:px-8 shadow">
      <div className="flex items-center">
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-yellow-600">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-2 mt-2 md:mt-0">
        <button
          className="w-full md:w-auto px-3 py-2 text-xs md:text-sm bg-yellow-500 bg-opacity-80 text-gray-950 rounded-lg hover:bg-yellow-700 transition duration-200"
          onClick={() => navigate("/profile")}
        >
          Mi Cuenta
        </button>
        <button
          className="w-full md:w-auto px-3 py-2 text-xs md:text-sm bg-yellow-500 bg-opacity-80 text-gray-950 rounded-lg hover:bg-yellow-700 transition duration-200"
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
        payCategories={payCategories}
        getTransacciones={getTransacciones}
      />
    </header>
  );
}

export default Header;
