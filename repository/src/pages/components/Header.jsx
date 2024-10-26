import React, { useState } from "react";
import logo from "../../assets/logo-removebg-preview.png";
import ModalVerCategorias from "./ModalVerCategorias";
import { useNavigate } from "react-router-dom";

function Header({
  payCategories,
  setPayCategories,
  fetchPersonalCategorias,
  getTransacciones,
  openModal = () => {},
}) {
  const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
  const navigate = useNavigate();

  const openModalCategoria = () => setIsModalCategoriaOpen(true);
  const closeModalCategoria = () => setIsModalCategoriaOpen(false);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full py-4 md:py-6 px-6 md:px-10">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-yellow-600 shadow-md">
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-4 md:mt-0 gap-3">
        <button
          className="flex-grow md:flex-none md:w-auto px-4 py-2 text-sm font-semibold bg-yellow-500 text-gray-950 rounded-lg shadow hover:bg-yellow-600 transition-all duration-300 ease-in-out h-12"
          onClick={() => navigate("/profile")}
        >
          Mi Cuenta
        </button>
        <button
          className="flex-grow md:flex-none md:w-auto px-4 py-2 text-sm font-semibold bg-yellow-500 text-gray-950 rounded-lg shadow hover:bg-yellow-600 transition-all duration-300 ease-in-out h-12"
          onClick={openModalCategoria}
        >
          Categorías
        </button>
        {/* Drawer Menu */}
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex items-center">
            <label
              htmlFor="my-drawer"
              className="btn-circle text-yellow-600 hover:text-yellow-700 transition duration-300 ease-in-out text-3xl"
            >
              ☰
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-3 shadow-lg">
              <li>
                <button
                  className="btn w-full bg-yellow-500 text-gray-950 text-lg rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                  onClick={() => {
                    openModal();
                    setIsModalCategoriaOpen(false);
                  }}
                >
                  Agregar Transacción
                </button>
              </li>
              <li>
                <button
                  className="btn w-full mt-3 bg-yellow-500 text-gray-950 text-lg rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                  onClick={() => {
                    document.getElementById("sendPayModal").showModal();
                    setIsModalCategoriaOpen(false);
                  }}
                >
                  Realizar Pago
                </button>
              </li>
              <li>
                <button
                  className="btn mt-3 w-full bg-yellow-500 text-gray-950 text-lg rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                  onClick={() => {
                    document.getElementById("generatePayModal").showModal();
                    setIsModalCategoriaOpen(false);
                  }}
                >
                  Generar Cobro
                </button>
              </li>
              <li>
                <button
                  className="btn mt-3 w-full bg-yellow-500 text-gray-950 text-lg rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                  onClick={() => {
                    navigate("/presupuestos");
                  }}
                >
                  Presupuesto
                </button>
              </li>
              <li>
                <button
                  className="btn mt-3 w-full bg-yellow-500 text-gray-950 text-lg rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                  onClick={() => {}}
                >
                  Gastos Compartidos
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Categorias */}
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
