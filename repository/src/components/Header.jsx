import React, { useState } from "react";
import logo from "../assets/logo-removebg-preview.png";
import ModalVerCategorias from "./ModalVerCategorias";

function Header() {
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
  const [payCategories, setPayCategories] = useState([]);

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
        `https://two024-qwerty-back-2.onrender.com/api/auth`,
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
      <div className="flex justify-end items-center px-4 md:px-20">
        <button
          className="w-auto mr-2 bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
          onClick={() => navigate("/profile")}
        >
          Mi Cuenta
        </button>
        <button
          className="w-auto bg-yellow-500 bg-opacity-80 text-gray-950 text-sm py-2 px-4 rounded-lg hover:bg-yellow-700"
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
